import express from 'express';
import { register, login, logout, getUser, getCsrfToken } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// CSRF token route
router.get('/csrf-token', getCsrfToken);

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', auth, logout);

// Get user data route
router.get('/user', auth, getUser);

export default router;