import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Repository } from 'typeorm';
import { MenuListQuery, CreateMenuForm } from './forms';
import { MenuListItemDto, CreateMenuResultDto } from './dtos';

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

  async createMenu(
    restaurantId: number,
    form: CreateMenuForm,
  ): Promise<CreateMenuResultDto> {
    const menu = this.menuRepository.create({
      ...form,
      restaurantId,
    });
    const saved = await this.menuRepository.save(menu);
    return {
      id: saved.id,
      name: saved.name,
      price: Number(saved.price),
      category: saved.category,
      description: saved.description,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
