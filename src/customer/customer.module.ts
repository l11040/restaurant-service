import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from 'src/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CustomerAuthModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerAuthModule],
})
export class CustomerModule {}
