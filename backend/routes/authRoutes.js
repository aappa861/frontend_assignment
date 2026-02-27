import express from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

export default router;
