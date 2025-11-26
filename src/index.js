import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import logger from './config/logger.js';

/**
 * Iniciar servidor
 */
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar servidor HTTP
    const server = app.listen(config.port, () => {
      logger.info(`Servidor corriendo en puerto ${config.port}`);
      logger.info(`Entorno: ${config.nodeEnv}`);
      logger.info(`API disponible en http://localhost:${config.port}/api`);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} recibido. Cerrando servidor...`);
      
      server.close(async () => {
        logger.info('Servidor HTTP cerrado');
        await disconnectDB();
        process.exit(0);
      });

      // Force close despues de 10 segundos
      setTimeout(() => {
        logger.error('Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminacion
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

  } catch (error) {
    logger.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();