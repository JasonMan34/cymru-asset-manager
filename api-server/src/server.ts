/* eslint-disable no-fallthrough */
import './dotenv';
import http from 'http';
import { app } from './app';
import { logger } from './logger';
import { setup, teardown } from './setup';

const DEFAULT_PORT = '4000';
const PORT = parseInt(process.env.PORT || DEFAULT_PORT);

app.set('port', PORT);

// Default onError
const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`port requires elevated privileges`, { error, bind });
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`port is already in use`, { error, bind });
      process.exit(1);
    default:
      throw error;
  }
};

const onListening = () => {
  logger.info(`Application started. Listening on port ${PORT} 🚀`);
};

process.on('uncaughtException', exception => {
  teardown()
    .catch((error: any) => {
      logger.error(`Error while attempting teardown`, { error });
    })
    .finally(() => {
      logger.error(`Uncaught Exception`, { error: exception });
      process.exit(1);
    });
});

process.on('unhandledRejection', (reason: any) => {
  logger.error(`Unhandled Rejection`, { error: reason });
});

process.on('SIGINT', () => {
  // Graceful shutdown
  teardown()
    .then(() => process.exit(0))
    .catch((error: any) => {
      logger.error(`Error while attempting teardown`, { error });
      process.exit(1);
    });
});

setup()
  .then(() => {
    const server = http.createServer(app);
    server.on('error', onError);
    server.on('listening', onListening);
    server.listen(PORT);
  })
  .catch((e: Error) => {
    logger.error(`Could not set up server`, { error: e, message: e.message });
  });
