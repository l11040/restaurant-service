import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '레스토랑 ID',
    example: 'restaurant123',
  })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
