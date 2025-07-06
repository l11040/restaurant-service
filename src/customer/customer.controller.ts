import { Controller, UseGuards, Post, Body, Req } from '@nestjs/common';
import { CustomerJwtAuthGuard } from './auth/customer-jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateReservationForm } from './forms';
import { CreateReservationResponseDto } from './dtos';
import { RequestWithUser } from './auth/customer-auth.controller';

@ApiTags('고객/예약')
@Controller('customer')
@UseGuards(CustomerJwtAuthGuard)
@ApiBearerAuth('access-token')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('reservations')
  @ApiOperation({ summary: '식당 예약 생성' })
  @ApiBody({ type: CreateReservationForm })
  async createReservation(
    @Req() req: RequestWithUser,
    @Body() form: CreateReservationForm,
  ): Promise<CreateReservationResponseDto> {
    const customerId = req.user.id;
    return this.customerService.createReservation(customerId, form);
  }
}
