import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        status: 'FAILED',
        error: {
            message: `Route not found: ${req.method} ${req.originalUrl}`,
            code: 'NOT_FOUND',
        },
    });
};
