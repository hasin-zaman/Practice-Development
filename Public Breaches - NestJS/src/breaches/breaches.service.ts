import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { BreachApiResponse } from './types/breach.interface';
import { VerifiedBreach } from './types/verified-breach.interface';
import { successResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class BreachesService {
  constructor(private prisma: PrismaService) {}

  async syncVerifiedBreaches() {
    const url = 'https://haveibeenpwned.com/api/v2/breaches';
    const { data } = await axios.get<BreachApiResponse[]>(url);

    const verifiedBreaches = data.filter(
      (breach) => breach.IsVerified === true,
    );

    const result: VerifiedBreach[] = [];

    for (const breach of verifiedBreaches) {
      try {
        const created = await this.prisma.breach.upsert({
          where: { name: breach.Name },
          update: {},
          create: {
            name: breach.Name,
            title: breach.Title,
            domain: breach.Domain,
            breachDate: new Date(breach.BreachDate),
            addedDate: new Date(breach.AddedDate),
            modifiedDate: new Date(breach.ModifiedDate),
            pwnCount: breach.PwnCount,
            description: breach.Description,
            logoPath: breach.LogoPath,
            dataClasses: breach.DataClasses,
            isVerified: breach.IsVerified,
          },
        });

        result.push(created);
      } catch (error) {
        console.error(`Error saving ${breach.Name}:`, error.message);
      }
    }

    return successResponse({ count: result.length, message: 'Verified breaches synced.' });
  }

  async getVerifiedBreaches(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [breaches, total] = await Promise.all([
        this.prisma.breach.findMany({
            skip,
            take: limit,
            orderBy: { breachDate: 'desc' }
        }),
        this.prisma.breach.count(),
    ])

    return successResponse({ breaches, total, page, lastPage: Math.ceil(total / limit) });
  }
}
