import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

interface ValidateSchemas {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

export const validate = (schemas: ValidateSchemas) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (schemas.body) req.body = schemas.body.parse(req.body);
        if (schemas.params) schemas.params.parse(req.params);
        if (schemas.query) schemas.query.parse(req.query);
        next();
    };
};
