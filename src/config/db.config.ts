// import { ConfigService } from '@nestjs/config';
// // import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as fs from 'fs';

// export function getDbConfig(
//   configService: ConfigService,
// ): TypeOrmModuleOptions {
//   const isProduction = configService.get('NODE_ENV') === 'production';
//   const baseOptions: TypeOrmModuleOptions = {
//     type: 'postgres' as const,
//     retryDelay: 3000,
//     retryAttempts: 10,
//     autoLoadEntities: true,
//     entities: [__dirname + '/../**/*.entity.{js,ts}'],
//     logging: isProduction ? ['error', 'warn'] : ['query', 'error', 'warn'],
//     synchronize: !isProduction,
//     name: 'analytics',
//     extra: {
//       connectionTimeoutMillis: 10000,
//       idleTimeoutMillis: 0,
//       keepAlive: true,
//     },
//   };
//   let environmentOptions: Partial<TypeOrmModuleOptions> = {};
//   if (!isProduction) {
//     environmentOptions = {
//       url: configService.get<string>('POSTGRES_URL'),
//     };
//   } else {
//     environmentOptions = {
//       host: configService.get<string>('DB_HOST'),
//       port: parseInt(configService.get<string>('DB_PORT')),
//       username: configService.get<string>('DB_USERNAME'),
//       password: configService.get<string>('DB_PASSWORD'),
//       database: configService.get<string>('DB_NAME'),
//       ssl: {
//         ca: fs.readFileSync(configService.get<string>('CERT_PATH')).toString(),
//         rejectUnauthorized: true,
//       },
//     };
//   }
//   return {
//     ...baseOptions,
//     ...environmentOptions,
//   } as TypeOrmModuleOptions;
// }
