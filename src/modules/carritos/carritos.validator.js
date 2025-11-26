import { validators } from '../../middlewares/validator.middleware.js';

/**
 * Validacion para agregar item al carrito
 */
export const validateAddItem = (data) => {
  const errors = [];

  const productoIdError = validators.positiveInteger(data.productoId, 'productoId');
  if (productoIdError) {
    errors.push({ field: 'productoId', message: productoIdError });
  }

  const cantidadError = validators.positiveInteger(data.cantidad, 'cantidad');
  if (cantidadError) {
    errors.push({ field: 'cantidad', message: cantidadError });
  } else if (data.cantidad > 100) {
    errors.push({ field: 'cantidad', message: 'No se puede agregar mas de 100 unidades' });
  }

  return errors;
};

/**
 * Validacion para actualizar cantidad
 */
export const validateUpdateQuantity = (data) => {
  const errors = [];

  const cantidadError = validators.positiveInteger(data.cantidad, 'cantidad');
  if (cantidadError) {
    errors.push({ field: 'cantidad', message: cantidadError });
  } else if (data.cantidad > 100) {
    errors.push({ field: 'cantidad', message: 'No se puede tener mas de 100 unidades' });
  }

  return errors;
};