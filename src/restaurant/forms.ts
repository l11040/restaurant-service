import {
  IsOptional,
  IsString,
  IsNumberString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { MenuCategory } from './enums';

export class MenuListQuery {
  @ApiPropertyOptional({ description: '메뉴 이름(일부 검색)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '최소 가격' })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional({ description: '최대 가격' })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;
}

export class CreateMenuForm {
  @ApiProperty({ description: '메뉴 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '카테고리', enum: MenuCategory })
  @IsEnum(MenuCategory)
  category: MenuCategory;

  @ApiProperty({ description: '설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
