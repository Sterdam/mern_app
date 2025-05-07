import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate a secure random filename to prevent path traversal attacks
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${fileExtension}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only specific image types
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeTypeValid = allowedTypes.test(file.mimetype);
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimeTypeValid && extValid) {
    return cb(null, true);
  }
  
  cb(new Error('Invalid file type. Only JPEG, JPG, PNG and GIF images are allowed.'), false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

export default upload;