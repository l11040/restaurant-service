import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
