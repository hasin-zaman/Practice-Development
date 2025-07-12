import { Module } from '@nestjs/common';
import { BreachesService } from './breaches.service';
import { BreachesController } from './breaches.controller';

@Module({
  providers: [BreachesService],
  controllers: [BreachesController]
})
export class BreachesModule {}
