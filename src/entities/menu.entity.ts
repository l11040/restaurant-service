import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum MenuCategory {
  WESTERN = '양식',
  JAPANESE = '일식',
  CHINESE = '중식',
}

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id', type: 'int' })
  restaurantId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: MenuCategory })
  category: MenuCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
