import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Menu } from './menu.entity';

@Entity('reservation_menus')
export class ReservationMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reservation_id', type: 'int' })
  reservationId: number;

  @Column({ name: 'menu_id', type: 'int' })
  menuId: number;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => Menu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;
}
