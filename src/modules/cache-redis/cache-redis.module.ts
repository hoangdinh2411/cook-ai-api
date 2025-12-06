import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { CacheRedisService } from './cache-redis.service';

@Module({
  imports:[ CacheModule.registerAsync({
    isGlobal:true,
    inject:[ConfigService],
    useFactory: async(config:ConfigService)=>{
      const url = config.get<string>("REDIS_URL")
      const redisStore =new KeyvRedis(url)
      redisStore.on('error',(err)=>console.error('Redis connection error:',err))
      return {
          
        stores: [
          redisStore
        ]
      }
    },
  
  })],
  providers: [CacheRedisService]
})
export class CacheRedisModule {}
