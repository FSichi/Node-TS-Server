import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../database/models/Usuario.js';
import { AppError } from '../errors/AppError.js';
import { config } from '../config/env.js';

export const requireAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    const token = req.header('x-token');
    if (!token) throw new AppError(401, 'No hay token en la petición');

    let uid: string;
    try {
        ({ uid } = jwt.verify(token, config.SECRETORPRIVATEKEY) as { uid: string });
    } catch (err) {
        if ((err as Error).name === 'TokenExpiredError') {
            throw new AppError(401, 'El token ha expirado');
        }
        throw new AppError(401, 'Token no válido');
    }

    const usuario = await UsuarioModel.findById(uid);
    if (!usuario) throw new AppError(401, 'Token no válido — usuario inexistente');
    if (!usuario.estado) throw new AppError(401, 'Token no válido — usuario deshabilitado');

    req.usuario = usuario;
    next();
};
