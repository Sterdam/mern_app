import Image from '../models/Image.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload a new image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const { title, description } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const newImage = new Image({
      title,
      description,
      imageUrl,
      user: req.user
    });

    const savedImage = await newImage.save();

    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all images
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 }).populate('user', 'username');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's images
export const getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single image
export const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate('user', 'username');
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if user owns the image
    if (image.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }
    
    // Delete image from fs
    const imagePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
