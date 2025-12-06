import {
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OPENAI_CLIENT } from 'common/constants/variables';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import OpenAI, { APIError, InternalServerError } from 'openai';

@Injectable()
export class IngredientsService {
    constructor(
        private readonly configService: ConfigService,
        @Inject(OPENAI_CLIENT) private readonly openAI: OpenAI,
    ) {}

    async detectingIngredients(file: Express.Multer.File): Promise<string[]> {
        const image_url = await this.convertImageToBase64(file);
        return await this.extractIngredientsFromImage(image_url);
    }

    async convertImageToBase64(file: Express.Multer.File): Promise<string> {
        const prefix = `data:${file.mimetype};base64,`;
        const base64 = file.buffer.toString('base64');
        return prefix + base64;
    }

    async generateRedisKey(file: Express.Multer.File): Promise<string> {
        return createHash('sha256').update(file.buffer).digest('hex');
    }

    sanitizeJsonOutput(output: string): string {
        return output.replace(/```json|```/g, '').trim();
    }
    async extractIngredientsFromImage(image_url: string): Promise<string[]> {
        const vision_model = this.configService.get<string>(
            'OPENAI_VISION_MODEL',
        );
        try {
            const result = await this.openAI.responses.create({
                model: vision_model,
                max_output_tokens: 300,
                temperature: 0,
                input: [
                    {
                        role: 'system',
                        content: `Return ONLY a JSON array of visible ingredients with confidence >= 0.7.
              Do not include generic items (oil, salt, pepper, spices, water).
              Example: ["tomato", "cheese"]`,
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'input_text',
                                text: 'Identify visible ingredients',
                            },
                            {
                                type: 'input_image',
                                image_url: image_url,
                                detail: 'auto',
                            },
                        ],
                    },
                ],
            });
            const raw = result.output_text;

            // Clean and parse
            const cleaned = this.sanitizeJsonOutput(raw);
            return JSON.parse(cleaned);
        } catch (error) {
            if (error instanceof APIError) {
                throw new HttpException(
                    'OpenAI error: ' + error.message,
                    error.status,
                );
            } else {
                throw new InternalServerErrorException(
                    'Unexpected error: ' + (error as Error).message,
                );
            }
        }
    }
}
