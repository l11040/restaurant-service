import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Restaurant } from '../../entities/restaurant.entity';

@Injectable()
export class RestaurantAuthService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private jwtService: JwtService,
  ) {}

  async validateRestaurant(restaurantId: string, password: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantId },
    });

    if (restaurant && (await bcrypt.compare(password, restaurant.password))) {
      return restaurant;
    }
    return null;
  }

  async register(registerDto: {
    restaurantId: string;
    password: string;
    name: string;
  }) {
    // 기존 레스토랑 ID 확인
    const existingRestaurant = await this.restaurantRepository.findOne({
      where: { restaurantId: registerDto.restaurantId },
    });

    if (existingRestaurant) {
      throw new ConflictException('이미 존재하는 레스토랑 ID입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 새 레스토랑 생성
    const newRestaurant = this.restaurantRepository.create({
      restaurantId: registerDto.restaurantId,
      password: hashedPassword,
      name: registerDto.name,
    });

    const savedRestaurant = await this.restaurantRepository.save(newRestaurant);

    // 비밀번호 제외하고 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedRestaurant;
    return result;
  }

  async login(restaurant: Restaurant) {
    // 기존 토큰이 있다면 만료 처리
    if (restaurant.token) {
      await this.restaurantRepository.update(
        { id: restaurant.id },
        { token: undefined, expireAt: undefined },
      );
    }

    // 새로운 토큰 생성
    const token = this.generateRandomToken();
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 24); // 24시간 후 만료

    // JWT 페이로드 생성
    const payload = {
      sub: restaurant.id,
      restaurantId: restaurant.restaurantId,
      token: token,
    };

    // 데이터베이스에 토큰 저장
    await this.restaurantRepository.update(
      { id: restaurant.id },
      {
        token: token,
        expireAt: expireAt,
      },
    );

    return {
      access_token: this.jwtService.sign(payload),
      restaurant: {
        id: restaurant.id,
        restaurantId: restaurant.restaurantId,
        name: restaurant.name,
      },
      expires_at: expireAt,
    };
  }

  async logout(restaurantId: number) {
    await this.restaurantRepository.update(
      { id: restaurantId },
      { token: undefined, expireAt: undefined },
    );
    return { message: '로그아웃되었습니다.' };
  }

  async refreshToken(restaurantId: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant || !restaurant.token) {
      throw new UnauthorizedException('유효한 토큰이 없습니다.');
    }

    // 토큰 만료 시간 확인
    if (restaurant.expireAt && new Date() > restaurant.expireAt) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }

    // 새로운 만료 시간 설정
    const newExpireAt = new Date();
    newExpireAt.setHours(newExpireAt.getHours() + 24);

    await this.restaurantRepository.update(
      { id: restaurantId },
      { expireAt: newExpireAt },
    );

    const payload = {
      sub: restaurant.id,
      restaurantId: restaurant.restaurantId,
      token: restaurant.token,
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_at: newExpireAt,
    };
  }

  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
