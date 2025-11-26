import { validators } from '../../middlewares/validator.middleware.js';

/**
 * Validacion para crear orden
 */
export const validateCreateOrder = (data) => {
  const errors = [];

  const direccionError = validators.required(data.direccionEnvio, 'direccionEnvio');
  if (direccionError) {
    errors.push({ field: 'direccionEnvio', message: direccionError });
  } else if (data.direccionEnvio.length < 10) {
    errors.push({
      field: 'direccionEnvio',
      message: 'Direccion de envio debe tener al menos 10 caracteres',
    });
  }

  if (data.tasaImpuesto !== undefined) {
    const tasaImpuesto = parseFloat(data.tasaImpuesto);
    if (isNaN(tasaImpuesto) || tasaImpuesto < 0 || tasaImpuesto > 1) {
      errors.push({
        field: 'tasaImpuesto',
        message: 'Tasa de impuesto debe ser un numero entre 0 y 1',
      });
    }
  }

  return errors;
};

/**
 * Validacion para actualizar estado
 */
export const validateUpdateStatus = (data) => {
  const errors = [];

  const estadoError = validators.required(data.estado, 'estado');
  if (estadoError) {
    errors.push({ field: 'estado', message: estadoError });
  }

  const estadosValidos = ['PENDIENTE', 'PAGADA', 'ENVIADA', 'ENTREGADA', 'CANCELADA'];
  if (data.estado && !estadosValidos.includes(data.estado)) {
    errors.push({
      field: 'estado',
      message: `Estado invalido. Valores permitidos: ${estadosValidos.join(', ')}`,
    });
  }

  return errors;
};