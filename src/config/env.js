import dotenv from 'dotenv';

dotenv.config();

/**
 * Validacion y exportacion de variables de entorno
 * Asegura que todas las variables necesarias esten presentes
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Variable de entorno faltante: ${varName}`);
  }
});

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  },
};