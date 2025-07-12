import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { BreachesService } from './breaches.service';

@Controller('breaches')
export class BreachesController {
  constructor(private readonly breachesService: BreachesService) {}

  @Post('sync')
  sync() {
    return this.breachesService.syncVerifiedBreaches();
  }

  @Get()
  getBreaches(@Query('page', ParseIntPipe) page, @Query('limit', ParseIntPipe) limit) {
    return this.breachesService.getVerifiedBreaches(page, limit);
  }
}
