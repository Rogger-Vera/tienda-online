import { errorResponse } from '../utils/response.util.js';

/**
 * Middleware de validacion generico
 * Valida el body de la request segun un schema
 * 
 * @param {function} validationFn - Funcion de validacion que retorna errores
 * @returns {function} Middleware function
 */
export const validate = (validationFn) => {
  return (req, res, next) => {
    const errors = validationFn(req.body);
    
    if (errors.length > 0) {
      return errorResponse(res, 400, 'Error de validacion', errors);
    }
    
    next();
  };
};

/**
 * Validaciones comunes reutilizables
 */
export const validators = {
  /**
   * Validar email
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email es requerido';
    if (!emailRegex.test(email)) return 'Email invalido';
    return null;
  },

  /**
   * Validar password
   */
  password: (password, minLength = 6) => {
    if (!password) return 'Password es requerido';
    if (password.length < minLength) {
      return `Password debe tener al menos ${minLength} caracteres`;
    }
    return null;
  },

  /**
   * Validar campo requerido
   */
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} es requerido`;
    }
    return null;
  },

  /**
   * Validar numero positivo
   */
  positiveNumber: (value, fieldName) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} debe ser un numero positivo`;
    }
    return null;
  },

  /**
   * Validar numero entero positivo
   */
  positiveInteger: (value, fieldName) => {
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
      return `${fieldName} debe ser un numero entero positivo`;
    }
    return null;
  },
};