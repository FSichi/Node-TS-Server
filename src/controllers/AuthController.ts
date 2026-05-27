import { Request, Response } from 'express';
import AuthService from '../services/AuthService.js';
import { AppError } from '../errors/AppError.js';
import { LoginInput, ChangePasswordInput } from '../schemas/auth.schema.js';

class AuthController {
    private authService = new AuthService();

    login = async (
        req: Request<unknown, unknown, LoginInput>,
        res: Response,
    ): Promise<void> => {
        const { correo, password } = req.body;
        const { token, usuario } = await this.authService.login(correo, password);
        res.json({
            status: 'OK',
            data: { authenticated: true, user: usuario, token },
        });
    };

    renewToken = async (req: Request, res: Response): Promise<void> => {
        if (!req.usuario) throw new AppError(401, 'No autenticado');
        const token = this.authService.renewToken(req.usuario.id);
        res.json({ status: 'OK', data: { token } });
    };

    updateUserPassword = async (
        req: Request<unknown, unknown, ChangePasswordInput>,
        res: Response,
    ): Promise<void> => {
        const { correo, password } = req.body;
        const result = await this.authService.updateUserPassword(correo, password);
        res.json({
            status: 'OK',
            data: { usuarioId: result.usuarioId, newPassword: result.hashedPassword },
        });
    };
}

export default AuthController;
