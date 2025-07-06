import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { ReservationMenu } from '../entities/reservation-menu.entity';
import { Menu } from '../entities/menu.entity';
import { CreateReservationForm } from './forms';
import { CreateReservationResponseDto } from './dtos';
import { LessThan, MoreThan, In } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationMenu)
    private readonly reservationMenuRepository: Repository<ReservationMenu>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async createReservation(
    customerId: number,
    form: CreateReservationForm,
  ): Promise<CreateReservationResponseDto> {
    // 1. 메뉴가 해당 레스토랑에 있는지 검증
    const menus = await this.menuRepository.find({
      where: {
        id: In(form.menuIds),
        restaurantId: form.restaurantId,
      },
    });
    if (menus.length !== form.menuIds.length) {
      throw new BadRequestException(
        '선택한 메뉴 중 일부가 해당 레스토랑에 존재하지 않습니다.',
      );
    }

    // 2. 시간 겹침 검증
    const overlap = await this.reservationRepository.findOne({
      where: {
        restaurantId: form.restaurantId,
        reservationDate: new Date(form.reservationDate.slice(0, 10)),
        startTime: LessThan(form.endTime),
        endTime: MoreThan(form.startTime),
      },
    });
    if (overlap) {
      throw new BadRequestException('해당 시간에 이미 예약이 존재합니다.');
    }

    // 예약 정보 저장
    const reservation = this.reservationRepository.create({
      restaurantId: form.restaurantId,
      customerId,
      reservationDate: form.reservationDate.slice(0, 10),
      startTime: form.startTime,
      endTime: form.endTime,
      phone: form.phone,
      peopleCount: form.peopleCount,
    });
    const savedReservation = await this.reservationRepository.save(reservation);

    // 예약-메뉴 연결 저장
    const reservationMenus = form.menuIds.map((menuId) =>
      this.reservationMenuRepository.create({
        reservationId: savedReservation.id,
        menuId,
      }),
    );
    await this.reservationMenuRepository.save(reservationMenus);

    // 결과 반환
    return {
      id: savedReservation.id,
      restaurantId: savedReservation.restaurantId,
      customerId: savedReservation.customerId,
      reservationDate: String(savedReservation.reservationDate),
      startTime: savedReservation.startTime,
      endTime: savedReservation.endTime,
      phone: savedReservation.phone,
      peopleCount: savedReservation.peopleCount,
      menuIds: form.menuIds,
      createdAt: savedReservation.createdAt.toISOString(),
      updatedAt: savedReservation.updatedAt.toISOString(),
    };
  }
}
