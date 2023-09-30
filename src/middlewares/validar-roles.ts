import { NextFunction, Response, response } from 'express';
import { handleErrorResponse } from '../messages/HTTPResponse.js';
import { UserRoles } from '../database/enums/index.js';
import { UsuarioDocument } from '../database/models/Usuario.ts';
import { RequestWithUsuario } from '../interfaces/index.ts';

const verificarRol = (roles: UserRoles[]) => {
    return (req: RequestWithUsuario, res: Response = response, next: NextFunction) => {

        const usuario = req.usuario as UsuarioDocument;

        if (!usuario) {
            return handleErrorResponse(res, {
                status: 401,
                message: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if (!roles.includes(usuario.rol)) {
            return handleErrorResponse(res, {
                status: 401,
                message: `El servicio requiere uno de estos roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

export const esAdminRole = verificarRol([UserRoles.ADMIN]);

export const tieneRole = (...roles: UserRoles[]) => verificarRol(roles);

export default { esAdminRole, tieneRole };