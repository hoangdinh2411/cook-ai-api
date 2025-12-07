import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ingredients')
export class HealthController {
    constructor() {}

    @UseInterceptors(FileInterceptor('file'))
    @Get('/')
    async vision() {
        return 'ok';
    }
}
