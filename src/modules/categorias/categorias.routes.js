import { Router } from 'express';
import categoriasController from './categorias.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validator.middleware.js';
import { validateCreateCategoria, validateUpdateCategoria } from './categorias.validator.js';

const router = Router();

/**
 * @route   GET /api/v1/categorias
 * @desc    Obtener todas las categorias
 * @access  Public
 */
router.get(
  '/',
  categoriasController.getAllCategorias.bind(categoriasController)
);

/**
 * @route   GET /api/v1/categorias/:id
 * @desc    Obtener categoria por ID
 * @access  Public
 */
router.get(
  '/:id',
  categoriasController.getCategoriaById.bind(categoriasController)
);

/**
 * @route   POST /api/v1/categorias
 * @desc    Crear nueva categoria
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(validateCreateCategoria),
  categoriasController.createCategoria.bind(categoriasController)
);

/**
 * @route   PUT /api/v1/categorias/:id
 * @desc    Actualizar categoria
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(validateUpdateCategoria),
  categoriasController.updateCategoria.bind(categoriasController)
);

/**
 * @route   DELETE /api/v1/categorias/:id
 * @desc    Desactivar categoria
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  categoriasController.deactivateCategoria.bind(categoriasController)
);

/**
 * @route   PATCH /api/v1/categorias/:id/reactivate
 * @desc    Reactivar categoria
 * @access  Private/Admin
 */
router.patch(
  '/:id/reactivate',
  authenticate,
  requireAdmin,
  categoriasController.reactivateCategoria.bind(categoriasController)
);

export default router;