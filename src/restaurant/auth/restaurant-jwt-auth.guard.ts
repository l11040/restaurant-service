import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RestaurantJwtAuthGuard extends AuthGuard('restaurant-jwt') {}
