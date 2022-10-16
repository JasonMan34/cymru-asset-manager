import { ErrorRequestHandler } from 'express';

/**
 * Error handler for express.\
 * Do not delete the last parameter `next`, that is how Express knows this is an error handler
 */
export const errorHandler = (): ErrorRequestHandler => async (err, req, res, next) => {
  if (err) {
    // Handle thrown error
  }
};
