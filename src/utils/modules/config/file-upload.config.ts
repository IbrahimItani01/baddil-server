import { diskStorage } from 'multer';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';
import { CustomRequest } from '../interface/custom-request.interface';

export const fileUploadOptions = {
  storage: diskStorage({
    destination: './uploads/profile-pictures', // Store files in this folder
    filename: (req, file, callback) => {
      const customReq = req as unknown as CustomRequest; // Cast req to the custom type
      const userId = customReq.user.id; // Extract userId from the request object
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const uniqueFilename = `${userId}-profile-pic-${timestamp}${fileExtension}`;
      callback(null, uniqueFilename); // Generate unique filename
    },
  }),
  fileFilter: (_, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid file type'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
};
