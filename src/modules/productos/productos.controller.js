import productosService from './productos.service.js';
import { successResponse } from '../../utils/response.util.js';

/**
 * Controlador de productos
 * Maneja las requests HTTP relacionadas con productos
 */
class ProductosController {
  /**
   * Obtener todos los productos
   * GET /api/v1/productos
   */
  async getAllProductos(req, res, next) {
    try {
      const result = await productosService.getAllProductos(req.query);
      
      return successResponse(
        res,
        200,
        'Productos obtenidos exitosamente',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener producto por ID
   * GET /api/v1/productos/:id
   */
  async getProductoById(req, res, next) {
    try {
      const producto = await productosService.getProductoById(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Producto obtenido exitosamente',
        producto
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear nuevo producto
   * POST /api/v1/productos
   */
  async createProducto(req, res, next) {
    try {
      const producto = await productosService.createProducto(req.body);
      
      return successResponse(
        res,
        201,
        'Producto creado exitosamente',
        producto
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar producto
   * PUT /api/v1/productos/:id
   */
  async updateProducto(req, res, next) {
    try {
      const producto = await productosService.updateProducto(
        parseInt(req.params.id),
        req.body
      );
      
      return successResponse(
        res,
        200,
        'Producto actualizado exitosamente',
        producto
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desactivar producto
   * DELETE /api/v1/productos/:id
   */
  async deactivateProducto(req, res, next) {
    try {
      const producto = await productosService.deactivateProducto(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Producto desactivado exitosamente',
        producto
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reactivar producto
   * PATCH /api/v1/productos/:id/reactivate
   */
  async reactivateProducto(req, res, next) {
    try {
      const producto = await productosService.reactivateProducto(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Producto reactivado exitosamente',
        producto
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar stock de producto
   * PATCH /api/v1/productos/:id/stock
   */
  async updateStock(req, res, next) {
    try {
      const producto = await productosService.updateStock(
        parseInt(req.params.id),
        parseInt(req.body.cantidad)
      );
      
      return successResponse(
        res,
        200,
        'Stock actualizado exitosamente',
        producto
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verificar disponibilidad de stock
   * GET /api/v1/productos/:id/stock/check?cantidad=5
   */
  async checkStock(req, res, next) {
    try {
      const result = await productosService.checkStock(
        parseInt(req.params.id),
        parseInt(req.query.cantidad)
      );
      
      return successResponse(
        res,
        200,
        result.disponible ? 'Stock disponible' : 'Stock insuficiente',
        result
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductosController();