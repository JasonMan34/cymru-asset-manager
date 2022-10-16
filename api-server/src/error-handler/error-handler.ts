import { ErrorRequestHandler, Request, Response } from 'express';
import { NamedError } from './named-error';

type NamedErrorRequestHandler = (err: NamedError, req: Request, res: Response) => any;

const namedErrorHandlers: Record<string, NamedErrorRequestHandler> = {};

/**
 * Error handler for express.\
 * Do not delete the last parameter `next`, that is how Express knows this is an error handler
 */
export const errorHandler = (): ErrorRequestHandler => async (err, req, res, next) => {
  if (err) {
    // Handle error
    if (namedErrorHandlers[err.name]) {
      // Specific error handler
    } else {
      // Generic error handler
    }
  }
};
