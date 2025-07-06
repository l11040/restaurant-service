import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '레스토랑 ID',
    example: 'test',
  })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({
    description: '비밀번호',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
