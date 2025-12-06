import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { RecipesService } from './recipes.service';
import { RecipesInputDto } from './dtos/recipes.dto';

@Controller('recipes')
export class RecipesController {
    constructor(
        private readonly configService: ConfigService,
        private readonly recipesService: RecipesService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    @Post('/')
    async recipes(@Body() filter: RecipesInputDto) {
        const normalizedFilter = this.recipesService.normalizeFilter(filter);
        const cache_key =
            await this.recipesService.generateRedisKey(normalizedFilter);
        const cached = await this.cacheManager.get<string>(cache_key);
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (err) {
                console.error('Invalid JSON in cache:', err, cached);
                await this.cacheManager.del(cache_key); // clear bad cache
            }
        }

        const result = await this.recipesService.findRecipes(normalizedFilter);
        const value =
            typeof result === 'string' ? result : JSON.stringify(result);
        await this.cacheManager.set(
            cache_key,
            value,
            Number(
                this.configService.get<string>('RECIPES_CACHE_TTL') || 36000,
            ),
        );

        return result;
    }
}
