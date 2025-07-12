import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BreachesModule } from './breaches/breaches.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BreachesModule,
    PrismaModule
  ],
})
export class AppModule {}
