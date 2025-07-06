import {
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Query,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { RestaurantJwtAuthGuard } from './auth/restaurant-jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { MenuListQuery, CreateMenuForm } from './forms';
import { CreateMenuResultDto } from './dtos';
import { RequestWithUser } from './auth/restaurant-auth.controller';

@ApiTags('레스토랑/메뉴')
@Controller('restaurant')
@UseGuards(RestaurantJwtAuthGuard)
@ApiBearerAuth('access-token')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('menu')
  @ApiBody({ type: CreateMenuForm })
  async addMenu(
    @Body() form: CreateMenuForm,
    @Req() req: RequestWithUser,
  ): Promise<CreateMenuResultDto> {
    const restaurantId = req.user.id;
    return this.restaurantService.createMenu(restaurantId, form);
  }

  @Get('menu')
  @ApiQuery({
    name: 'name',
    required: false,
    description: '메뉴 이름(일부 검색)',
  })
  @ApiQuery({ name: 'minPrice', required: false, description: '최소 가격' })
  @ApiQuery({ name: 'maxPrice', required: false, description: '최대 가격' })
  async getMenu(@Query() query: MenuListQuery, @Req() req: RequestWithUser) {
    const restaurantId = req.user.id;
    return this.restaurantService.getMenus(restaurantId, query);
  }

  @Delete('menu/:menuId')
  @ApiParam({ name: 'menuId', required: true, description: '삭제할 메뉴 id' })
  async deleteMenu(
    @Param('menuId') menuId: string,
    @Req() req: RequestWithUser,
  ) {
    const restaurantId = req.user.id;
    return this.restaurantService.deleteMenu(restaurantId, Number(menuId));
  }
}
