import categoriasService from './categorias.service.js';
import { successResponse } from '../../utils/response.util.js';

/**
 * Controlador de categorias
 * Maneja las requests HTTP relacionadas con categorias
 */
class CategoriasController {
  /**
   * Obtener todas las categorias
   * GET /api/v1/categorias
   */
  async getAllCategorias(req, res, next) {
    try {
      const result = await categoriasService.getAllCategorias(req.query);
      
      return successResponse(
        res,
        200,
        'Categorias obtenidas exitosamente',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener categoria por ID
   * GET /api/v1/categorias/:id
   */
  async getCategoriaById(req, res, next) {
    try {
      const categoria = await categoriasService.getCategoriaById(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Categoria obtenida exitosamente',
        categoria
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear nueva categoria
   * POST /api/v1/categorias
   */
  async createCategoria(req, res, next) {
    try {
      const categoria = await categoriasService.createCategoria(req.body);
      
      return successResponse(
        res,
        201,
        'Categoria creada exitosamente',
        categoria
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar categoria
   * PUT /api/v1/categorias/:id
   */
  async updateCategoria(req, res, next) {
    try {
      const categoria = await categoriasService.updateCategoria(
        parseInt(req.params.id),
        req.body
      );
      
      return successResponse(
        res,
        200,
        'Categoria actualizada exitosamente',
        categoria
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desactivar categoria
   * DELETE /api/v1/categorias/:id
   */
  async deactivateCategoria(req, res, next) {
    try {
      const categoria = await categoriasService.deactivateCategoria(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Categoria desactivada exitosamente',
        categoria
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reactivar categoria
   * PATCH /api/v1/categorias/:id/reactivate
   */
  async reactivateCategoria(req, res, next) {
    try {
      const categoria = await categoriasService.reactivateCategoria(parseInt(req.params.id));
      
      return successResponse(
        res,
        200,
        'Categoria reactivada exitosamente',
        categoria
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoriasController();