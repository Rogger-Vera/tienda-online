import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import AppError from './AppError.js';

/**
 * Generar token JWT
 * @param {object} payload - Datos a incluir en el token (id, email, roleId)
 * @returns {string} Token JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Verificar y decodificar token JWT
 * @param {string} token - Token a verificar
 * @returns {object} Payload decodificado
 * @throws {AppError} Si el token es invalido o expiro
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expirado', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token invalido', 401);
    }
    throw new AppError('Error al verificar token', 401);
  }
};