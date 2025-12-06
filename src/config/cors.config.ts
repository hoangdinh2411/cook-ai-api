import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

const allowOrigins = ['http://localhost:3000', 'http://localhost:3001'];
@Injectable()
export class CorsConfigService {
  constructor() {}
  getOptions(configServer: ConfigService): CorsOptions {
    const CORS_OPTIONS: CorsOptions = {
      origin: (origin, callback) => {
        if (
          !origin ||
          [
            ...allowOrigins,
            configServer.get<string>('CLIENT_HOST'),
            configServer.get<string>('ADMIN_HOST'),
            configServer.get<string>('API_URL'),
          ].includes(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'Content-Type',
        'Accept',
        'Set-Cookie',
        'Cookie',
        'Authorization',
      ],
    };
    return CORS_OPTIONS;
  }
}
