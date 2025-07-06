import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsDateString,
  IsString,
  IsArray,
  ArrayNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateReservationForm {
  @ApiProperty({ description: '식당 ID' })
  @IsInt()
  restaurantId: number;

  @ApiProperty({ description: '예약 날짜' })
  @IsDateString()
  reservationDate: string;

  @ApiProperty({ description: '예약 시작 시간' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: '예약 종료 시간' })
  @IsString()
  endTime: string;

  @ApiProperty({ description: '전화번호' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: '인원 수' })
  @IsInt()
  @Min(1)
  peopleCount: number;

  @ApiProperty({ type: [Number], description: '메뉴 ID 배열' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  menuIds: number[];
}
