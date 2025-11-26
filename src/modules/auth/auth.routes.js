import { Router } from 'express';
import authController from './auth.controller.js';
import { validate } from '../../middlewares/validator.middleware.js';
import { validateRegister, validateLogin } from './auth.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  validate(validateRegister),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post(
  '/login',
  validate(validateLogin),
  authController.login.bind(authController)
);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  authController.getProfile.bind(authController)
);

export default router;