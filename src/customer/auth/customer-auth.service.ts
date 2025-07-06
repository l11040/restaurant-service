import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class CustomerAuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async validateCustomer(customerId: string, password: string) {
    const customer = await this.customerRepository.findOne({
      where: { customerId },
    });

    if (customer && (await bcrypt.compare(password, customer.password))) {
      return customer;
    }
    return null;
  }

  async register(registerDto: {
    customerId: string;
    password: string;
    name: string;
  }) {
    // 기존 레스토랑 ID 확인
    const existingCustomer = await this.customerRepository.findOne({
      where: { customerId: registerDto.customerId },
    });

    if (existingCustomer) {
      throw new ConflictException('이미 존재하는 고객 ID입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 새 고객 생성
    const newCustomer = this.customerRepository.create({
      customerId: registerDto.customerId,
      password: hashedPassword,
      name: registerDto.name,
    });

    const savedCustomer = await this.customerRepository.save(newCustomer);

    // 비밀번호 제외하고 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedCustomer;
    return result;
  }

  async login(customer: Customer) {
    // 기존 토큰이 있다면 만료 처리
    if (customer.token) {
      await this.customerRepository.update(
        { id: customer.id },
        { token: undefined, expireAt: undefined },
      );
    }

    // 새로운 토큰 생성
    const token = this.generateRandomToken();
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 24); // 24시간 후 만료

    // JWT 페이로드 생성
    const payload = {
      sub: customer.id,
      customerId: customer.customerId,
      token: token,
    };

    // 데이터베이스에 토큰 저장
    await this.customerRepository.update(
      { id: customer.id },
      {
        token: token,
        expireAt: expireAt,
      },
    );

    return {
      access_token: this.jwtService.sign(payload),
      customer: {
        id: customer.id,
        customerId: customer.customerId,
        name: customer.name,
      },
      expires_at: expireAt,
    };
  }

  async logout(customerId: number) {
    await this.customerRepository.update(
      { id: customerId },
      { token: undefined, expireAt: undefined },
    );
    return { message: '로그아웃되었습니다.' };
  }

  async refreshToken(customerId: number) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer || !customer.token) {
      throw new UnauthorizedException('유효한 토큰이 없습니다.');
    }

    // 토큰 만료 시간 확인
    if (customer.expireAt && new Date() > customer.expireAt) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }

    // 새로운 만료 시간 설정
    const newExpireAt = new Date();
    newExpireAt.setHours(newExpireAt.getHours() + 24);

    await this.customerRepository.update(
      { id: customerId },
      { expireAt: newExpireAt },
    );

    const payload = {
      sub: customer.id,
      customerId: customer.customerId,
      token: customer.token,
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
