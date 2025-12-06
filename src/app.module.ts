import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    InternalServerErrorException,
    MiddlewareConsumer,
    Module,
} from '@nestjs/common';
import { LoggerMiddleware } from 'common/middlewares/requestLogger.middleware';
import { CorsConfigService } from 'config/cors.config';
import { SwaggerApiDocService } from 'config/apiDocs.config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
import { DatabaseConfig } from 'config/dto/config.dto';
import { validateSync } from 'class-validator';
// import { getDbConfig } from 'config/db.config';
import { Modules } from 'modules';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'common/guards/jwtAuth.guard';
import { RoleGuard } from 'common/guards/role.guard';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import OpenAI from 'openai';
import { OPENAI_CLIENT } from 'common/constants/variables';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (config) => {
                const configObject = new DatabaseConfig();
                Object.assign(configObject, config);
                const errors = validateSync(configObject);
                if (errors.length > 0) {
                    throw new InternalServerErrorException(
                        'DB Configuration validation failed on property: ' +
                            errors[0].property,
                    );
                }
                return config;
            },
        }),

        // ScheduleModule.forRoot(),
        // TypeOrmModule.forRootAsync({
        //   useFactory: (configService: ConfigService) => getDbConfig(configService),
        //   inject: [ConfigService],
        // }),
        Modules,
    ],
    providers: [
        CorsConfigService,
        SwaggerApiDocService,
        // {
        //   provide: APP_GUARD,
        //   useClass: JwtAuthGuard,
        // },
        // { provide: APP_GUARD, useClass: RoleGuard },
    ],
})
export class AppModule {
    constructor() {}
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('*path');
    }
}
