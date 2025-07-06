import { Controller, UseGuards } from '@nestjs/common';
import { CustomerJwtAuthGuard } from './auth/customer-jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

@ApiTags('고객')
@Controller('customer')
@UseGuards(CustomerJwtAuthGuard)
@ApiBearerAuth('access-token')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
}
