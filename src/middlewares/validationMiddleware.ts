import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validationMiddleware<T>(schema: ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(error => error.message);
      res.status(400).json({
        status: 'Error',
        message: errors 
      });
    } else {
      req.body = result.data;
      next();
    }
  };
}
