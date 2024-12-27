import { diskStorage } from 'multer'; // 📂 Importing diskStorage to handle file uploads
import * as path from 'path'; // 🛠️ Importing path to handle file extensions and paths
import { BadRequestException } from '@nestjs/common'; // ❌ Importing BadRequestException for handling errors
import { CustomRequest } from '../interface/custom-request.interface'; // 🔑 Importing the custom request interface to type the request object

// 🖼️ File upload configuration for profile pictures
export const fileUploadOptions = {
  // 📁 Configure storage options for uploaded files
  storage: diskStorage({
    // 📍 Set the destination folder where files will be stored
    destination: './uploads/profile-pictures', // Folder to store profile pictures
    // 📝 Define how the filename will be generated
    filename: (req, file, callback) => {
      const customReq = req as unknown as CustomRequest; // 🔄 Cast req to the custom request type
      const userId = customReq.user.id; // 🧑‍💻 Extract the user ID from the request
      const timestamp = Date.now(); // 🕒 Generate a unique timestamp for the file name
      const fileExtension = path.extname(file.originalname).toLowerCase(); // 🖼️ Get the file extension (jpg, png)
      const uniqueFilename = `${userId}-profile-pic-${timestamp}${fileExtension}`; // 🏷️ Generate a unique filename with userId and timestamp
      callback(null, uniqueFilename); // ✅ Accept the unique filename
    },
  }),

  // 🧾 File filter to restrict file types
  fileFilter: (_, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; // ✅ Define allowed image types
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid file type'), false); // ❌ Reject invalid file types
    }
    callback(null, true); // ✅ Accept valid file types
  },

  // 🏋️‍♂️ Set file upload size limits
  limits: {
    fileSize: 5 * 1024 * 1024, // ⛔ Limit file size to 5MB
  },
};

// 🖼️ File upload configuration for item images
export const itemImagesUploadOptions = {
  // 📁 Configure storage options for item images
  storage: diskStorage({
    // 📍 Set dynamic destination path based on user and item
    destination: (req, _, callback) => {
      const customReq = req as any; // 🔄 Cast to any for flexibility
      const userId = customReq.user.id; // 🧑‍💻 Extract the user ID
      const itemId = customReq.itemId; // 🏷️ Get the itemId (set during item creation)
      const uploadPath = `./uploads/items-images/${userId}/${itemId}`; // 📂 Define path as a user-specific folder with itemId
      callback(null, uploadPath); // ✅ Accept the dynamic upload path
    },

    // 📝 Define how the filename will be generated
    filename: (_, file, callback) => {
      const timestamp = Date.now(); // 🕒 Generate a timestamp for uniqueness
      const fileExtension = path.extname(file.originalname).toLowerCase(); // 🖼️ Get the file extension (jpg, png)
      const uniqueFilename = `${timestamp}${fileExtension}`; // 🏷️ Create a unique filename based on timestamp
      callback(null, uniqueFilename); // ✅ Accept the unique filename
    },
  }),

  // 🧾 File filter to restrict file types
  fileFilter: (_, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; // ✅ Define allowed image types
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid file type'), false); // ❌ Reject invalid file types
    }
    callback(null, true); // ✅ Accept valid file types
  },

  // 🏋️‍♂️ Set file upload size limits
  limits: {
    fileSize: 5 * 1024 * 1024, // ⛔ Limit file size to 5MB
  },
};
