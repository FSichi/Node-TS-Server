import { Request, Response } from "express";

import { handleErrorLogin, handleErrorResponse, handleSuccessResponse } from "../messages/HTTPResponse.js";
import AuthService from "../services/AuthService.ts";
import { RequestWithUsuario } from "../interfaces/index.ts";


class AuthController {

    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {

        const { correo, password } = req.body;

        try {
            const { token, usuario } = await this.authService.checkStatusForLogin(correo, password);
            handleSuccessResponse(res, 200, { authenticated: true, user: usuario, token: token });
        } catch (error) {
            handleErrorLogin(res, error);
        }
    }

    public renewToken = async (req: RequestWithUsuario, res: Response): Promise<void> => {

        const usuario = req.usuario;

        try {
            const { token } = await this.authService.renewToken(usuario?._id);
            handleSuccessResponse(res, 200, { token: token });
        } catch (error) {
            handleErrorResponse(res, { status: (error as any).status || 500, message: (error as any).message || error });
        }
    }


}

export default AuthController;