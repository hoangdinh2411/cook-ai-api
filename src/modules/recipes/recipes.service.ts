import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { RecipeOutputDto, RecipesInputDto } from './dtos/recipes.dto';
import { OPENAI_CLIENT } from 'common/constants/variables';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RecipesService {
    constructor(
        @Inject(OPENAI_CLIENT) private readonly openAI: OpenAI,
        private readonly configService: ConfigService,
    ) {}

    /*
    Convert confirmed ingredients + constraints into EXACTLY 5 recipes.
    Always returns a dict per strict JSON schema.

    ingredients_list = [ "gà",...]
    constraints_dict = {
        "diet": "regular|keto|vegetarian|...",
        "allergies": ["peanut", ...],
        "max_minutes": 30,
        "cuisine": "vietnamese|japanese|...",
        "allowed_methods": str[]  
    }

    Output schema:
    {
      "recipes": [{
        "title": str,
        "time_minutes": int,
        "difficulty": "easy" | "medium",
        "method": 
        "ingredients": string[],
        "missing": [str],                          
        "substitutions": [{"for": str, "use": str}],  
        "steps": [str],                              
        "reasons": [str] 
      } x 5]
    }
    **/
    async findRecipes(input: RecipesInputDto): Promise<RecipeOutputDto> {
        const DEFAULT_MAX_RECIPES = 5;
        const SYSTEM_PREFIX = `You are a concise culinary assistant. 
    Return ONLY JSON matching the schema. No prose.`;

        let TASK_PREFIX = `Goal: Generate exactly ${DEFAULT_MAX_RECIPES} recipes.
            Each step must be clear and actionable, 2–3 short sentences if needed.
            List all necessary ingredients.
            Max 2 substitutions.
            ALL fields (title, steps, reasons, method, difficulty, substitutions, ingredients) MUST be in ${input.output_lang}.
            `;
        if (input.ingredients) {
            TASK_PREFIX += ` Ingredients available: ${input.ingredients.join(', ')}.`;
        }

        if (input.diet) {
            TASK_PREFIX += ` Diet constraint: ${input.diet}.`;
        }
        if (input.allergies && input.allergies.length > 0) {
            TASK_PREFIX += ` Allergies to avoid: ${input.allergies.join(', ')}.`;
        }
        if (input.max_minutes) {
            TASK_PREFIX += ` Max cooking time: ${input.max_minutes} minutes.`;
        }
        if (input.cuisine) {
            TASK_PREFIX += ` Cuisine style: ${input.cuisine}.`;
        }
        if (input.allowed_methods && input.allowed_methods.length > 0) {
            TASK_PREFIX += ` Allowed cooking methods: ${input.allowed_methods.join(', ')}.`;
        }

        const recipe_model = this.configService.get<string>(
            'OPENAI_RECIPES_MODEL',
        );
        const result = await this.openAI.responses.create({
            model: recipe_model,
            max_output_tokens: 2000,
            temperature: 0.7,
            input: [
                {
                    role: 'system',
                    content: SYSTEM_PREFIX,
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: TASK_PREFIX,
                        },
                    ],
                },
            ],
            text: {
                format: {
                    name: 'RecipesSchema',
                    type: 'json_schema',
                    strict: true,
                    schema: {
                        type: 'object',
                        required: ['recipes'],
                        additionalProperties: false,
                        properties: {
                            recipes: {
                                type: 'array',
                                minItems: DEFAULT_MAX_RECIPES,
                                maxItems: DEFAULT_MAX_RECIPES,
                                items: {
                                    additionalProperties: false,
                                    type: 'object',
                                    required: [
                                        'title',
                                        'time_minutes',
                                        'difficulty',
                                        'method',
                                        'missing',
                                        'substitutions',
                                        'steps',
                                        'reasons',
                                        'ingredients',
                                    ],

                                    properties: {
                                        title: {
                                            type: 'string',
                                        },
                                        time_minutes: {
                                            type: 'integer',
                                        },
                                        difficulty: {
                                            type: 'string',
                                            enum: ['easy', 'medium'],
                                        },

                                        ingredients: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            },
                                        },
                                        method: {
                                            type: 'string',
                                            description:
                                                'Main cooking method (e.g., grill, stir-fry, steam)',
                                        },
                                        missing: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            },
                                        },
                                        substitutions: {
                                            type: 'array',

                                            items: {
                                                additionalProperties: false,
                                                type: 'object',
                                                properties: {
                                                    for: {
                                                        type: 'string',
                                                    },
                                                    use: {
                                                        type: 'string',
                                                    },
                                                },
                                                required: ['for', 'use'],
                                            },
                                        },
                                        steps: {
                                            type: 'array',
                                            maxItems: 5,
                                            items: { type: 'string' },
                                            description:
                                                'Detailed step-by-step instructions',
                                        },
                                        reasons: {
                                            type: 'array',
                                            maxItems: 2,
                                            items: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        console.log('Recipe generation result:', result);
        return JSON.parse(result.output_text);
    }
    normalizeIngredients(ingredients: string[]): string {
        return ingredients
            .map((i) => i.trim().toLowerCase())
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .sort()
            .join(',');
    }
    normalizeFilter(input: RecipesInputDto): RecipesInputDto {
        const keys = Object.keys(input);
        const normalized: RecipesInputDto = { ...input };
        for (const key of keys) {
            if (!normalized.hasOwnProperty(key)) continue;

            const element = normalized[key];
            if (Array.isArray(element) && element.length) {
                normalized[key] = element
                    .map((i) => i.trim().toLowerCase())
                    .filter((v, i, arr) => arr.indexOf(v) === i)
                    .sort();
            }
            if (typeof element === 'string') {
                normalized[key] = element.trim().toLowerCase();
            }
        }
        return normalized;
    }

    serializeRecipeFilter(input: RecipesInputDto): string {
        const parts = [`recipe:${input.output_lang}`];
        if (input.diet) {
            parts.push(`diet=${input.diet}`);
        }
        if (input.allergies) {
            parts.push(`allergies=${input.allergies.join(',')}`);
        }
        if (input.max_minutes) {
            parts.push(`max_minutes=${input.max_minutes}`);
        }

        if (input.cuisine) {
            parts.push(`cuisine=${input.cuisine}`);
        }
        if (input.allowed_methods) {
            parts.push(`allowed_methods=${input.allowed_methods.join(',')}`);
        }
        return parts.join(':');
    }

    async generateRedisKey(filter: RecipesInputDto): Promise<string> {
        const serializedFilter = this.serializeRecipeFilter(filter);
        return createHash('sha256').update(serializedFilter).digest('hex');
    }
}
