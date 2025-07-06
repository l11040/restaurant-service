import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from 'src/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAuthModule } from './auth/auth.module';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationMenu } from 'src/entities/reservation-menu.entity';
import { Menu } from 'src/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Reservation, ReservationMenu, Menu]),
    CustomerAuthModule,
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerAuthModule],
})
export class CustomerModule {}
