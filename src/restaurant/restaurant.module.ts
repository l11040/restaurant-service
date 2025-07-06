import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantAuthModule } from './auth/auth.module';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Menu } from 'src/entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Menu]), RestaurantAuthModule],
  providers: [RestaurantService],
  controllers: [RestaurantController],
  exports: [RestaurantAuthModule],
})
export class RestaurantModule {}
