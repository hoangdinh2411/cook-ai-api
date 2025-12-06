import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FilterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: () => 'string',
    default: 'Store abc',
    description: 'Search text',
  })
  search_text?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @ApiProperty({
    type: () => 'number',
    default: 25,
    description:
      'The coupon caps the discount at 58 % off the item or order total.',
  })
  max_discount_pct?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  @ApiProperty({
    type: () => 'number',
    default: 1,
    description: 'Rating of ',
  })
  rating?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: () => 'number',
    default: 1,
    description: 'page',
  })
  page?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: () => 'limit',
    default: 1,
    description: 'limit',
  })
  limit?: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: () => 'array',
    default: [1, 2, 3],
    description: 'an array of category ids',
  })
  categories?: number[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: () => 'array',
    default: [1, 2, 3],
    description: 'an array of topic ids for blogs',
  })
  topics?: number[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: [Number],
    default: [1],
    description: 'Store ids',
  })
  stores?: number[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    default: [0, 1, 2],
    description: 'Status coupon',
  })
  status?: number[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    default: false,
    description: 'coupon is verified?',
  })
  is_verified?: boolean;
}
