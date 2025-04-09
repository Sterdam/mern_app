import express from 'express';
import { register, login, getUser } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get user data route
router.get('/user', auth, getUser);

export default router;
