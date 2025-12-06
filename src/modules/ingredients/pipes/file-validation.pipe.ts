import {
  BadRequestException,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
    
@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new UnprocessableEntityException(
        'Invalid file type. Only JPEG and PNG files are allowed',
      );
    }

    const maximumFileSize = 1024 * 1024 * 2; // 2MB
    if (file.size > maximumFileSize) {
      throw new UnprocessableEntityException('File size is too large');
    }
    return file;
  }
}
