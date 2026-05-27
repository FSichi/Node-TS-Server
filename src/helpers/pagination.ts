import { Response } from 'express';
import { paginationQuerySchema, PaginationQuery } from '../schemas/pagination.schema.js';

export const getPagination = (res: Response): PaginationQuery => {
    const fromLocals = res.locals.validatedQuery as PaginationQuery | undefined;
    return fromLocals ?? paginationQuerySchema.parse({});
};
