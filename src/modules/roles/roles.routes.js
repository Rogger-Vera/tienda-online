import { Router } from 'express';
import rolesController from './roles.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/role.middleware.js';

const router = Router();

/**
 * Todas las rutas requieren autenticacion y rol admin
 */
router.use(authenticate, requireAdmin);

/**
 * @route   GET /api/v1/roles
 * @desc    Obtener todos los roles
 * @access  Private/Admin
 */
router.get(
  '/',
  rolesController.getAllRoles.bind(rolesController)
);

/**
 * @route   GET /api/v1/roles/:id
 * @desc    Obtener rol por ID
 * @access  Private/Admin
 */
router.get(
  '/:id',
  rolesController.getRoleById.bind(rolesController)
);

export default router;