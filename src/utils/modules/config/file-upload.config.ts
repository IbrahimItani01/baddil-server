import { diskStorage } from 'multer'; // 📂 Importing diskStorage to handle file uploads
import * as path from 'path'; // 🛠️ Importing path to handle file extensions and paths
import { BadRequestException } from '@nestjs/common'; // ❌ Importing BadRequestException for handling errors
import { ensureDynamicDirectoryExists } from 'src/utils/files/uploading.utils';
// 🖼️ File upload configuration for profile pictures
export const fileUploadOptions = {
  storage: diskStorage({
    destination: async (req, _, callback) => {
      try {
        const customReq = req as any;
        const userId = customReq.user.id;
        const uploadPath = await ensureDynamicDirectoryExists(
          './uploads',
          'profile-pictures',
          userId, // Dynamic subdirectory for user
        ); // Use the utility function
        callback(null, uploadPath);
      } catch (err) {
        callback(err, null); // Pass error to multer
      }
    },
    filename: (req, file, callback) => {
      const customReq = req as any;
      const userId = customReq.user.id;
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const uniqueFilename = `${userId}-profile-pic-${timestamp}${fileExtension}`;
      callback(null, uniqueFilename);
    },
  }),
  fileFilter: (_, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid file type'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};

// 🖼️ File upload configuration for item images
export const itemImagesUploadOptions = {
  storage: diskStorage({
    destination: async (req, _, callback) => {
      try {
        const customReq = req as any;
        const userId = customReq.user.id;
        const uploadPath = await ensureDynamicDirectoryExists(
          './uploads',
          'items-images',
          userId, // Dynamic subdirectory for user
        ); // Use the utility function
        callback(null, uploadPath);
      } catch (err) {
        callback(err, null); // Pass error to multer
      }
    },
    filename: (_, file, callback) => {
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const uniqueFilename = `${timestamp}${fileExtension}`;
      callback(null, uniqueFilename);
    },
  }),
  fileFilter: (_, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid file type'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
