import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class CacheRedisService  implements OnModuleInit {
  private logger: Logger;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.logger = new Logger(CacheRedisService.name);
  }

  async onModuleInit() {
    const key = 'cache_healthcheck';
    try {
      await this.cache.set(key, 'redis connected', 5_000); // 5s
      const value = await this.cache.get<string>(key);
      if(!value) {
        this.logger.error('❌ Redis cache healthcheck failed: Redis is disconnected');
        return
      }
      this.logger.log('✅ Redis cache healthcheck value:', value);
    } catch (err) {
      this.logger.error('❌ Redis cache healthcheck failed:', err);
    }
  }
}
