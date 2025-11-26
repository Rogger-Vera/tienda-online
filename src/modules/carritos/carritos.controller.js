import carritosService from './carritos.service.js';
import { successResponse } from '../../utils/response.util.js';

/**
 * Controlador de carritos
 * Maneja las requests HTTP relacionadas con carritos
 */
class CarritosController {
  /**
   * Obtener carrito del usuario autenticado
   * GET /api/v1/carrito
   */
  async getCart(req, res, next) {
    try {
      const carrito = await carritosService.getOrCreateCart(req.user.id);

      return successResponse(res, 200, 'Carrito obtenido exitosamente', carrito);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Agregar producto al carrito
   * POST /api/v1/carrito/items
   */
  async addItem(req, res, next) {
    try {
      const { productoId, cantidad } = req.body;
      const carrito = await carritosService.addItemToCart(
        req.user.id,
        productoId,
        cantidad
      );

      return successResponse(res, 200, 'Producto agregado al carrito', carrito);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar cantidad de un item
   * PUT /api/v1/carrito/items/:productoId
   */
  async updateItemQuantity(req, res, next) {
    try {
      const productoId = parseInt(req.params.productoId);
      const { cantidad } = req.body;

      const carrito = await carritosService.updateItemQuantity(
        req.user.id,
        productoId,
        cantidad
      );

      return successResponse(res, 200, 'Cantidad actualizada', carrito);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar item del carrito
   * DELETE /api/v1/carrito/items/:productoId
   */
  async removeItem(req, res, next) {
    try {
      const productoId = parseInt(req.params.productoId);
      const carrito = await carritosService.removeItemFromCart(req.user.id, productoId);

      return successResponse(res, 200, 'Producto eliminado del carrito', carrito);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Vaciar carrito
   * DELETE /api/v1/carrito
   */
  async clearCart(req, res, next) {
    try {
      const carrito = await carritosService.clearCart(req.user.id);

      return successResponse(res, 200, 'Carrito vaciado exitosamente', carrito);
    } catch (error) {
      next(error);
    }
  }
}

export default new CarritosController();