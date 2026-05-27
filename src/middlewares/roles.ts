import { Request, Response, NextFunction } from 'express';
import { UserRoles } from '../database/enums/index.js';
import { AppError } from '../errors/AppError.js';

const hasRole = (allowed: UserRoles[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.usuario) throw new AppError(401, 'No autenticado');
        if (!allowed.includes(req.usuario.rol)) {
            throw new AppError(403, `Se requiere uno de estos roles: ${allowed.join(', ')}`);
        }
        next();
    };

export const requireAdmin = hasRole([UserRoles.ADMIN]);
export const requireRoles = (...roles: UserRoles[]) => hasRole(roles);
