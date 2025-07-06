import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantAuthService } from './restaurant-auth.service';
import { RestaurantJwtStrategy } from './restaurant-jwt.strategy';
import { RestaurantAuthController } from './restaurant-auth.controller';
import { Restaurant } from '../../entities/restaurant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Restaurant]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [RestaurantAuthService, RestaurantJwtStrategy],
  controllers: [RestaurantAuthController],
  exports: [RestaurantAuthService],
})
export class RestaurantAuthModule {}
