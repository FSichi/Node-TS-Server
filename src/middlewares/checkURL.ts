import { Request, Response, NextFunction } from "express";
import { handleErrorResponse } from "../messages/HTTPResponse.js";

// interface IUrlNotFound {
//     req: Request;
//     res: Response;
//     next: NextFunction;
// }

// export const notFoundURL = ({ req, res, next }: IUrlNotFound) => {
export const notFoundURL = (req: Request, res: Response, next: NextFunction) => {
    handleErrorResponse({ res, error: { status: 404, message: `Ruta no encontrada: ${req.originalUrl}` } });
    next();
};

export default notFoundURL;