import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './pipes/file-validation.pipe';
import { IngredientsService } from './ingredients.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly ingredientsService: IngredientsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('/')
  async vision(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    try {
      const key = await this.ingredientsService.generateRedisKey(file);
      const cached = await this.cacheManager.get<string>(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const ingredients =
        await this.ingredientsService.detectingIngredients(file);
      await this.cacheManager.set(
        key,
        JSON.stringify(ingredients),
        Number(this.configService.get<string>('VISION_CACHE_TTL') || 36000),
      );
      return ingredients;
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
