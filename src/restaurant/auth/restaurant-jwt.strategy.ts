import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entities/restaurant.entity';
import { ConfigService } from '@nestjs/config';
import { RestaurantInfoDto } from './dto/auth-response.dto';

@Injectable()
export class RestaurantJwtStrategy extends PassportStrategy(
  Strategy,
  'restaurant-jwt',
) {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  async validate(payload: {
    sub: number;
    token: string;
  }): Promise<RestaurantInfoDto> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: payload.sub },
    });

    if (!restaurant) {
      throw new UnauthorizedException('레스토랑을 찾을 수 없습니다.');
    }

    // 토큰이 데이터베이스에 저장된 토큰과 일치하는지 확인
    if (restaurant.token !== payload.token) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    // 만료 시간 확인
    if (restaurant.expireAt && new Date() > restaurant.expireAt) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }

    return {
      id: restaurant.id,
      restaurantId: restaurant.restaurantId,
      name: restaurant.name,
    };
  }
}
