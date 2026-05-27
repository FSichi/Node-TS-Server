import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger/index.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            status: 'FAILED',
            error: {
                message: 'Validation error',
                code: 'VALIDATION_ERROR',
                issues: err.flatten(),
            },
        });
        return;
    }

    if (err instanceof AppError) {
        logger.warn({ statusCode: err.statusCode, code: err.code, path: req.path }, err.message);
        res.status(err.statusCode).json({
            status: 'FAILED',
            error: { message: err.message, code: err.code },
        });
        return;
    }

    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({
            status: 'FAILED',
            error: { message: 'Invalid JSON format', code: 'INVALID_JSON' },
        });
        return;
    }

    logger.error({ err, path: req.path }, 'Unhandled error');
    res.status(500).json({
        status: 'FAILED',
        error: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
    });
};
