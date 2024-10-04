import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const messages = errors
          .map(error => Object.values(error.constraints || {}))
          .flat();
        res.status(400).json({ errors: messages });
      } else {
        req.body = dtoObj;
        next();
      }
    });
  };
}