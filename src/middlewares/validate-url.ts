import { Request, Response, NextFunction } from "express";
import { handleErrorResponse } from "../messages/HTTPResponse.js";

export const notFoundURL = (req: Request, res: Response, next: NextFunction) => {
    handleErrorResponse(res, { status: 404, message: `Ruta no encontrada: ${req.originalUrl}` });
    next();
};

export default notFoundURL;