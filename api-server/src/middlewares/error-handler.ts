import { ErrorRequestHandler } from 'express';
import { logger } from '../logger';

/**
 * Error handler for express.\
 * Do not delete the last parameter `next`, that is how Express knows this is an error handler
 */
export const errorHandler = (): ErrorRequestHandler => async (err, req, res, next) => {
  if (err) {
    logger.error(`Error! ${err}`);

    res.status(500).send();
  }
};
