export class CreateReservationResponseDto {
  id: number;
  restaurantId: number;
  customerId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  phone: string;
  peopleCount: number;
  menuIds: number[];
  createdAt: string;
  updatedAt: string;
}
