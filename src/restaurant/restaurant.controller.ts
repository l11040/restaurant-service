import {
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { RestaurantJwtAuthGuard } from './auth/restaurant-jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { MenuListQuery } from './forms';
import { RestaurantInfoDto } from './auth/dto/auth-response.dto';

@Controller('restaurant')
@UseGuards(RestaurantJwtAuthGuard)
@ApiBearerAuth('access-token')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('menu')
  addMenu() {
    return { message: '메뉴 추가 기능이 구현될 예정입니다.' };
  }

  @Get('menu')
  @ApiQuery({
    name: 'name',
    required: false,
    description: '메뉴 이름(일부 검색)',
  })
  @ApiQuery({ name: 'minPrice', required: false, description: '최소 가격' })
  @ApiQuery({ name: 'maxPrice', required: false, description: '최대 가격' })
  async getMenu(
    @Query() query: MenuListQuery,
    @Req() req: Request & { user: RestaurantInfoDto },
  ) {
    const restaurantId = req.user.id;
    return this.restaurantService.getMenus(restaurantId, query);
  }

  @Delete('menu')
  deleteMenu() {
    return { message: '메뉴 삭제 기능이 구현될 예정입니다.' };
  }
}
