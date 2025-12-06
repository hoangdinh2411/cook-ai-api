import { IsString, IsOptional, Matches } from 'class-validator';

export class DatabaseConfig {
  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'DB_PORT must be a number' })
  API_PORT?: number;

  @IsString()
  @IsOptional()
  NODE_ENV?: string;

  // @IsString()
  // JWT_SECRET?: string;

  // @IsString()
  // POSTGRES_URL: string;

  @IsString()
  OPENAI_API_KEY: string;
  @IsString()
  OPENAI_VISION_MODEL: string;
  @IsString()
  OPENAI_RECIPES_MODEL: string;
  @IsString()
  MAX_IMAGE_BYTES: string;

 
}
