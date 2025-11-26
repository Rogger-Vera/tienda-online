import { validators } from '../../middlewares/validator.middleware.js';

/**
 * Validacion para crear categoria
 */
export const validateCreateCategoria = (data) => {
  const errors = [];

  const nombreError = validators.required(data.nombre, 'Nombre');
  if (nombreError) {
    errors.push({ field: 'nombre', message: nombreError });
  } else if (typeof data.nombre !== 'string' || data.nombre.trim().length < 3) {
    errors.push({ field: 'nombre', message: 'Nombre debe tener al menos 3 caracteres' });
  }

  if (data.descripcion && typeof data.descripcion !== 'string') {
    errors.push({ field: 'descripcion', message: 'Descripcion debe ser texto' });
  }

  return errors;
};

/**
 * Validacion para actualizar categoria
 */
export const validateUpdateCategoria = (data) => {
  const errors = [];

  if (data.nombre !== undefined) {
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 3) {
      errors.push({ field: 'nombre', message: 'Nombre debe tener al menos 3 caracteres' });
    }
  }

  if (data.descripcion !== undefined && data.descripcion !== null && typeof data.descripcion !== 'string') {
    errors.push({ field: 'descripcion', message: 'Descripcion debe ser texto' });
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive debe ser booleano' });
  }

  return errors;
};