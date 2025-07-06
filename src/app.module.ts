import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './utils/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    RestaurantModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
