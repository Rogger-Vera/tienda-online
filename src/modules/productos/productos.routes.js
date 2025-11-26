import { Router } from 'express';
import productosController from './productos.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validator.middleware.js';
import { 
  validateCreateProducto, 
  validateUpdateProducto,
  validateUpdateStock 
} from './productos.validator.js';

const router = Router();

/**
 * @route   GET /api/v1/productos
 * @desc    Obtener todos los productos (con filtros opcionales)
 * @access  Public
 * @query   ?page=1&limit=20&isActive=true&categoriaId=1&minPrecio=100&maxPrecio=1000&search=laptop
 */
router.get(
  '/',
  productosController.getAllProductos.bind(productosController)
);

/**
 * @route   GET /api/v1/productos/:id
 * @desc    Obtener producto por ID
 * @access  Public
 */
router.get(
  '/:id',
  productosController.getProductoById.bind(productosController)
);

/**
 * @route   GET /api/v1/productos/:id/stock/check
 * @desc    Verificar disponibilidad de stock
 * @access  Public
 * @query   ?cantidad=5
 */
router.get(
  '/:id/stock/check',
  productosController.checkStock.bind(productosController)
);

/**
 * @route   POST /api/v1/productos
 * @desc    Crear nuevo producto
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(validateCreateProducto),
  productosController.createProducto.bind(productosController)
);

/**
 * @route   PUT /api/v1/productos/:id
 * @desc    Actualizar producto
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(validateUpdateProducto),
  productosController.updateProducto.bind(productosController)
);

/**
 * @route   PATCH /api/v1/productos/:id/stock
 * @desc    Actualizar stock de producto
 * @access  Private/Admin
 */
router.patch(
  '/:id/stock',
  authenticate,
  requireAdmin,
  validate(validateUpdateStock),
  productosController.updateStock.bind(productosController)
);

/**
 * @route   DELETE /api/v1/productos/:id
 * @desc    Desactivar producto
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  productosController.deactivateProducto.bind(productosController)
);

/**
 * @route   PATCH /api/v1/productos/:id/reactivate
 * @desc    Reactivar producto
 * @access  Private/Admin
 */
router.patch(
  '/:id/reactivate',
  authenticate,
  requireAdmin,
  productosController.reactivateProducto.bind(productosController)
);

export default router;