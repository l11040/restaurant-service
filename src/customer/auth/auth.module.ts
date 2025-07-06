import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerJwtStrategy } from './customer-jwt.strategy';
import { CustomerAuthController } from './customer-auth.controller';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Customer]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [CustomerAuthService, CustomerJwtStrategy],
  controllers: [CustomerAuthController],
  exports: [CustomerAuthService],
})
export class CustomerAuthModule {}
