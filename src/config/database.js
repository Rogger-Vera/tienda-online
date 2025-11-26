import { PrismaClient } from "../generated/prisma/client.ts";
import logger from './logger.js';

/**
 * Cliente unico de Prisma para conexion a BD
 * Singleton pattern para evitar multiples instancias
 */
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Logging de queries SQL en desarrollo
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logger.warn(`Prisma Warning: ${e.message}`);
});

/**
 * Verificar conexion a la base de datos
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Conexion a base de datos exitosa');
  } catch (error) {
    logger.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

/**
 * Cerrar conexion a la base de datos
 */
export const disconnectDB = async () => {
  await prisma.$disconnect();
  logger.info('Base de datos desconectada');
};

export default prisma;