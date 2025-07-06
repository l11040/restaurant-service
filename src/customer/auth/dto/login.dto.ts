import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '고객 ID',
    example: 'customer123',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: '비밀번호',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
