import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';

export class RecipesInputDto {
    @IsArray()
    @IsString({ each: true })
    ingredients: string[];

    @IsOptional()
    @IsString()
    diet: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allergies: string[];

    @IsOptional()
    @IsNumber()
    @IsPositive()
    max_minutes: number;



    @IsOptional()
    @IsString()
    cuisine: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowed_methods: string[];

    @IsOptional()
    @IsString()
    output_lang: string;
}
export class NutritionDto {
    /** Per serving nutrition. Use null for unknown values */
    @IsOptional()
    @IsNumber()
    kcal?: number;

    @IsOptional()
    @IsNumber()
    protein_g?: number;

    @IsOptional()
    @IsNumber()
    carb_g?: number;

    @IsOptional()
    @IsNumber()
    fat_b?: number;
}
export class RecipeOutputDto {
    /** Structure of a generated recipe */
    @IsString()
    title: string;

    @IsNumber()
    time_minutes: number;

    @IsOptional()
    @IsEnum(['easy', 'medium'])
    difficulty: 'easy' | 'medium' = 'easy';

    @IsArray()
    @IsString({ each: true })
    missing: string[] = [];

    @IsArray()
    substitutions: Record<string, any>[] = [];

    @IsArray()
    @IsString({ each: true })
    steps: string[];

    @ValidateNested()
    @Type(() => NutritionDto)
    nutrition_per_serving: NutritionDto;

    ingredients:string[]
}


