import { ApiProperty } from '@nestjs/swagger';

export class CustomerInfoDto {
  @ApiProperty({
    description: '고객 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '고객 ID',
    example: 'customer123',
  })
  customerId: string;

  @ApiProperty({
    description: '고객 이름',
    example: '홍길동',
  })
  name: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: '고객 정보',
    type: CustomerInfoDto,
  })
  customer: CustomerInfoDto;

  @ApiProperty({
    description: '토큰 만료 시간',
    example: '2024-01-01T12:00:00.000Z',
  })
  expires_at: Date;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: '토큰 만료 시간',
    example: '2024-01-01T12:00:00.000Z',
  })
  expires_at: Date;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: '로그아웃 메시지',
    example: '로그아웃되었습니다.',
  })
  message: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: '고객 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '고객 ID',
    example: 'customer123',
  })
  customerId: string;

  @ApiProperty({
    description: '고객 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '생성 시간',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 시간',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;
}
