import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports:[ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: memoryStorage(),
        limits: {
          fieldSize:
            Number(configService.get<string>('MAX_IMAGE_BYTES')) ?? 2000000,
          files: 1,
        },
      }),
      inject:[ConfigService]
    }),
  ],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {}
