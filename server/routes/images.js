import express from 'express';
import { uploadImage, getAllImages, getUserImages, getImage, deleteImage } from '../controllers/imageController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload image
router.post('/', auth, upload.single('image'), uploadImage);

// Get all images
router.get('/all', getAllImages);

// Get user's images
router.get('/user', auth, getUserImages);

// Get single image
router.get('/:id', getImage);

// Delete image
router.delete('/:id', auth, deleteImage);

export default router;
