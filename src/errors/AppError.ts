export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code?: string;
    public readonly isOperational = true;

    constructor(statusCode: number, message: string, code?: string) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
