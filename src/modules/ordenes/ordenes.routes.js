import { Router } from 'express';
import ordenesController from './ordenes.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validator.middleware.js';
import { validateCreateOrder, validateUpdateStatus } from './ordenes.validator.js';

const router = Router();

/**
 * Todas las rutas requieren autenticacion
 */
router.use(authenticate);

/**
 * @route   GET /api/v1/ordenes/estadisticas/resumen
 * @desc    Obtener estadisticas de ordenes
 * @access  Private/Admin
 */
router.get(
  '/estadisticas/resumen',
  requireAdmin,
  ordenesController.getOrderStatistics.bind(ordenesController)
);

/**
 * @route   GET /api/v1/ordenes/mis-ordenes
 * @desc    Obtener ordenes del usuario autenticado
 * @access  Private
 */
router.get(
  '/mis-ordenes',
  ordenesController.getMyOrders.bind(ordenesController)
);

/**
 * @route   GET /api/v1/ordenes
 * @desc    Obtener todas las ordenes (admin)
 * @access  Private/Admin
 */
router.get(
  '/',
  requireAdmin,
  ordenesController.getAllOrders.bind(ordenesController)
);

/**
 * @route   POST /api/v1/ordenes
 * @desc    Crear orden desde el carrito
 * @access  Private
 */
router.post(
  '/',
  validate(validateCreateOrder),
  ordenesController.createOrder.bind(ordenesController)
);

/**
 * @route   GET /api/v1/ordenes/:id
 * @desc    Obtener orden por ID
 * @access  Private
 */
router.get('/:id', ordenesController.getOrderById.bind(ordenesController));

/**
 * @route   PATCH /api/v1/ordenes/:id/estado
 * @desc    Actualizar estado de orden
 * @access  Private/Admin
 */
router.patch(
  '/:id/estado',
  requireAdmin,
  validate(validateUpdateStatus),
  ordenesController.updateOrderStatus.bind(ordenesController)
);

/**
 * @route   POST /api/v1/ordenes/:id/cancelar
 * @desc    Cancelar orden
 * @access  Private
 */
router.post('/:id/cancelar', ordenesController.cancelOrder.bind(ordenesController));

export default router;