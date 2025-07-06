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
import { RestaurantAuthService } from './restaurant-auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
  RegisterResponseDto,
} from './dto/auth-response.dto';
import { RestaurantJwtAuthGuard } from './restaurant-jwt-auth.guard';
import { LoginDto } from './dto';

interface RequestWithUser extends Request {
  user: {
    id: number;
    restaurantId: string;
    name: string;
  };
}

@ApiTags('레스토랑 인증')
@Controller('restaurant/auth')
export class RestaurantAuthController {
  constructor(private restaurantAuthService: RestaurantAuthService) {}

  @Post('register')
  @ApiOperation({ summary: '레스토랑 회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 레스토랑 ID',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.restaurantAuthService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '레스토랑 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '잘못된 레스토랑 ID 또는 비밀번호',
  })
  async login(@Body() loginDto: LoginDto) {
    const restaurant = await this.restaurantAuthService.validateRestaurant(
      loginDto.restaurantId,
      loginDto.password,
    );

    if (!restaurant) {
      throw new UnauthorizedException(
        '잘못된 레스토랑 ID 또는 비밀번호입니다.',
      );
    }

    return this.restaurantAuthService.login(restaurant);
  }

  @UseGuards(RestaurantJwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '레스토랑 로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  async logout(@Request() req: RequestWithUser) {
    return this.restaurantAuthService.logout(req.user.id);
  }

  @UseGuards(RestaurantJwtAuthGuard)
  @Get('refresh')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: RefreshResponseDto,
  })
  async refreshToken(@Request() req: RequestWithUser) {
    return this.restaurantAuthService.refreshToken(req.user.id);
  }
}
