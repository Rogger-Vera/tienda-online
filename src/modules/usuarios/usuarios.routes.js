import { Router } from 'express';
import usuariosController from './usuarios.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/role.middleware.js';
import { requireAuth } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validator.middleware.js';
import { validateUpdateUser } from './usuarios.validator.js';

const router = Router();

/**
 * Todas las rutas requieren autenticacion
 */
router.use(authenticate);

/**
 * @route   GET /api/v1/usuarios
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Private/Admin
 */
router.get(
  '/',
  requireAdmin,
  usuariosController.getAllUsers.bind(usuariosController)
);

/**
 * @route   GET /api/v1/usuarios/:id
 * @desc    Obtener usuario por ID (admin o el mismo usuario)
 * @access  Private
 */
router.get(
  '/:id',
  requireAuth,
  usuariosController.getUserById.bind(usuariosController)
);

/**
 * @route   PUT /api/v1/usuarios/:id
 * @desc    Actualizar usuario (admin o el mismo usuario)
 * @access  Private
 */
router.put(
  '/:id',
  requireAuth,
  validate(validateUpdateUser),
  usuariosController.updateUser.bind(usuariosController)
);

/**
 * @route   DELETE /api/v1/usuarios/:id
 * @desc    Desactivar usuario (solo admin)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  requireAdmin,
  usuariosController.deactivateUser.bind(usuariosController)
);

/**
 * @route   PATCH /api/v1/usuarios/:id/reactivate
 * @desc    Reactivar usuario (solo admin)
 * @access  Private/Admin
 */
router.patch(
  '/:id/reactivate',
  requireAdmin,
  usuariosController.reactivateUser.bind(usuariosController)
);

export default router;