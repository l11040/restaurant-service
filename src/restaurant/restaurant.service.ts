import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Repository } from 'typeorm';
import { MenuListQuery } from './forms';
import { MenuListItemDto } from './dtos';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async getMenus(
    restaurantId: number,
    query: MenuListQuery,
  ): Promise<MenuListItemDto[]> {
    const qb = this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.restaurantId = :restaurantId', { restaurantId });

    if (query.name) {
      qb.andWhere('menu.name LIKE :name', { name: `%${query.name}%` });
    }
    if (query.minPrice) {
      qb.andWhere('menu.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      qb.andWhere('menu.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const menus = await qb.getMany();
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      price: Number(menu.price),
      category: menu.category,
      description: menu.description,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    }));
  }
}
