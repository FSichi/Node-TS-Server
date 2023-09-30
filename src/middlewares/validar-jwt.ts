import { response, request, NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { UsuarioModel } from '../database/models/Usuario.ts'
import { handleErrorResponse } from '../messages/HTTPResponse.js'
import { RequestWithUsuario } from '../interfaces/index.ts'


export const validarJWT = async (req: RequestWithUsuario = request, res: Response = response, next: NextFunction) => {

    const token = req.header('x-token');

    if (!token) {
        return handleErrorResponse(res, { status: 401, message: 'No hay token en la petición' });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY || '') as { uid: string };

        const usuario = await UsuarioModel.findById(uid);
        const { status, error } = checkUserStatus(usuario);

        if (!status) {
            return handleErrorResponse(res, { status: error!.status, message: error!.message });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        const errorMessage = (error as any).name === 'TokenExpiredError'
            ? { status: 401, message: 'El token ha expirado' }
            : { status: (error as any).status || 401, message: (error as any).message || 'Token no válido' };

        handleErrorResponse(res, errorMessage);
    }
}

const checkUserStatus = (user: any) => {

    if (!user) {
        return { status: false, error: { status: 401, message: 'Token no válido - usuario no existe DB' } };
    }

    if (!user.estado) {
        return { status: false, error: { status: 401, message: 'Token no válido - usuario con estado: false' } };
    }

    return { status: true, error: null };
};

export default validarJWT;