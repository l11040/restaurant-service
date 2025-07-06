import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
  RegisterResponseDto,
} from './dto/auth-response.dto';
import { LoginDto } from './dto';
import { CustomerInfoDto } from './dto/auth-response.dto';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerJwtAuthGuard } from './customer-jwt-auth.guard';

export interface RequestWithUser extends Request {
  user: CustomerInfoDto;
}

@ApiTags('고객 인증')
@Controller('customer/auth')
export class CustomerAuthController {
  constructor(private customerAuthService: CustomerAuthService) {}

  @Post('register')
  @ApiOperation({ summary: '고객 회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 고객 ID',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.customerAuthService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '고객 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '잘못된 고객 ID 또는 비밀번호',
  })
  async login(@Body() loginDto: LoginDto) {
    const customer = await this.customerAuthService.validateCustomer(
      loginDto.customerId,
      loginDto.password,
    );

    if (!customer) {
      throw new UnauthorizedException('잘못된 고객 ID 또는 비밀번호입니다.');
    }

    return this.customerAuthService.login(customer);
  }

  @UseGuards(CustomerJwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '고객 로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  async logout(@Request() req: RequestWithUser) {
    return this.customerAuthService.logout(req.user.id);
  }

  @UseGuards(CustomerJwtAuthGuard)
  @Get('refresh')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: RefreshResponseDto,
  })
  async refreshToken(@Request() req: RequestWithUser) {
    return this.customerAuthService.refreshToken(req.user.id);
  }
}
