import { Module } from '@nestjs/common';
import { CacheRedisModule } from './cache-redis/cache-redis.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { OpenaiModule } from './openai-client/openai-client.module';

@Module({
    imports: [CacheRedisModule, IngredientsModule, RecipesModule,OpenaiModule],
    providers: [],
})
export class Modules {}
