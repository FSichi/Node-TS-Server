import { Response, NextFunction } from "express";
import { handleErrorResponse } from "../messages/HTTPResponse.ts";

export const handleJsonSyntaxError = (res: Response, next: NextFunction, error: Error) => {

    if (error instanceof SyntaxError && (error as any).status === 400 && 'body' in error) {
        handleErrorResponse({ res, error: { status: 400, message: 'JSON mal formado - Formato JSON no permitido / Erroneo' } });
    } else {
        next(error);
    }

    return;
}

export default handleJsonSyntaxError;