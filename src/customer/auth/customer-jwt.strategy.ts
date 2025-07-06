import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomerInfoDto } from './dto/auth-response.dto';
import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(
  Strategy,
  'customer-jwt',
) {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
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
  }): Promise<CustomerInfoDto> {
    const customer = await this.customerRepository.findOne({
      where: { id: payload.sub },
    });

    if (!customer) {
      throw new UnauthorizedException('고객을 찾을 수 없습니다.');
    }

    // 토큰이 데이터베이스에 저장된 토큰과 일치하는지 확인
    if (customer.token !== payload.token) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    // 만료 시간 확인
    if (customer.expireAt && new Date() > customer.expireAt) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }

    return {
      id: customer.id,
      customerId: customer.customerId,
      name: customer.name,
    };
  }
}
