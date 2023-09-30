import { Request, Response, NextFunction } from 'express';
// import { handleErrorResponse } from '../messages/HTTPResponse.ts';

export const handleJsonSyntaxError = (error: any, _req: Request, res: Response, next: NextFunction) => {

    console.log('Hola desde handleJsonSyntaxError');

    if (error instanceof SyntaxError && 'body' in error) {
        res.status(400).json({ error: 'Invalid JSON format' });
        // handleErrorResponse(res, { status: 400, message: 'JSON mal formado - Formato JSON no permitido / Erroneo' });
    } else {
        next(error);
    }
};

export default handleJsonSyntaxError;