import { Router } from 'express';
import carritosController from './carritos.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validator.middleware.js';
import { validateAddItem, validateUpdateQuantity } from './carritos.validator.js';

const router = Router();

/**
 * Todas las rutas requieren autenticacion
 */
router.use(authenticate);

/**
 * @route   GET /api/v1/carrito
 * @desc    Obtener carrito del usuario autenticado
 * @access  Private
 */
router.get('/', carritosController.getCart.bind(carritosController));

/**
 * @route   POST /api/v1/carrito/items
 * @desc    Agregar producto al carrito
 * @access  Private
 */
router.post(
  '/items',
  validate(validateAddItem),
  carritosController.addItem.bind(carritosController)
);

/**
 * @route   PUT /api/v1/carrito/items/:productoId
 * @desc    Actualizar cantidad de un item
 * @access  Private
 */
router.put(
  '/items/:productoId',
  validate(validateUpdateQuantity),
  carritosController.updateItemQuantity.bind(carritosController)
);

/**
 * @route   DELETE /api/v1/carrito/items/:productoId
 * @desc    Eliminar item del carrito
 * @access  Private
 */
router.delete(
  '/items/:productoId',
  carritosController.removeItem.bind(carritosController)
);

/**
 * @route   DELETE /api/v1/carrito
 * @desc    Vaciar carrito
 * @access  Private
 */
router.delete('/', carritosController.clearCart.bind(carritosController));

export default router;