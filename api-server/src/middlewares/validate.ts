import { NextFunction, Request, Response } from 'express';

import { Result, ValidationError, validationResult } from 'express-validator';
import { logger } from '../logger';

interface ValidatorMiddleware {
  run: (req: Request) => Promise<Result>;
}

const formatter = ({ location, msg, param }: ValidationError) => `${location}[${param}]: ${msg}`;

// The following code is from https://express-validator.github.io/docs/running-imperatively.html
export const validate =
  (...validations: ValidatorMiddleware[]) =>
  async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const result = validationResult(req).formatWith(formatter);
    if (result.isEmpty()) {
      next();
    } else {
      logger.warn('Invalid API call received', { errors: result.array() });
      res.status(400).send('Error! Invalid body or query parameters');
    }
  };
