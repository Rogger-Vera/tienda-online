import ordenesService from './ordenes.service.js';
import { successResponse } from '../../utils/response.util.js';

/**
 * Controlador de ordenes
 * Maneja las requests HTTP relacionadas con ordenes
 */
class OrdenesController {
  /**
   * Crear orden desde el carrito
   * POST /api/v1/ordenes
   */
  async createOrder(req, res, next) {
    try {
      const orden = await ordenesService.createOrder(req.user.id, req.body);

      return successResponse(res, 201, 'Orden creada exitosamente', orden);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener ordenes del usuario autenticado
   * GET /api/v1/ordenes/mis-ordenes
   */
  async getMyOrders(req, res, next) {
    try {
      const result = await ordenesService.getUserOrders(req.user.id, req.query);

      return successResponse(res, 200, 'ordenes obtenidas exitosamente', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todas las ordenes (admin)
   * GET /api/v1/ordenes
   */
  async getAllOrders(req, res, next) {
    try {
      const result = await ordenesService.getAllOrders(req.query);

      return successResponse(res, 200, 'ordenes obtenidas exitosamente', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener orden por ID
   * GET /api/v1/ordenes/:id
   */
  async getOrderById(req, res, next) {
    try {
      const orden = await ordenesService.getOrderById(
        parseInt(req.params.id),
        req.user.id,
        req.user.role
      );

      return successResponse(res, 200, 'Orden obtenida exitosamente', orden);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar estado de orden (admin)
   * PATCH /api/v1/ordenes/:id/estado
   */
  async updateOrderStatus(req, res, next) {
    try {
      const orden = await ordenesService.updateOrderStatus(
        parseInt(req.params.id),
        req.body.estado
      );

      return successResponse(res, 200, 'Estado de orden actualizado', orden);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancelar orden
   * POST /api/v1/ordenes/:id/cancelar
   */
  async cancelOrder(req, res, next) {
    try {
      const orden = await ordenesService.cancelOrder(
        parseInt(req.params.id),
        req.user.id,
        req.user.role
      );

      return successResponse(res, 200, 'Orden cancelada exitosamente', orden);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadisticas de ordenes (admin)
   * GET /api/v1/ordenes/estadisticas/resumen
   */
  async getOrderStatistics(req, res, next) {
    try {
      const stats = await ordenesService.getOrderStatistics();

      return successResponse(res, 200, 'Estadisticas obtenidas exitosamente', stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrdenesController();