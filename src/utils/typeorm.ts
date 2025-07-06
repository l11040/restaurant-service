import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST') as string,
    port: +(configService.get('DB_PORT') as string) || 3312,
    username: configService.get('DB_USER') as string,
    password: configService.get('DB_PASSWORD') as string,
    database: configService.get('DB_NAME') as string,
    autoLoadEntities: true,
    synchronize: false,
    timezone: 'Z',
  }),
};
