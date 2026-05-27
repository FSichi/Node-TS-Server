import { UsuarioDocument } from '../database/models/Usuario.js';
import { hashPassword, verifyPassword } from '../helpers/passwordHelpers.js';
import { generarJWT } from '../helpers/generar-jwt.js';
import { AppError } from '../errors/AppError.js';
import UserRepository from '../repository/UserRepository.js';

class AuthService {
    private userRepository = new UserRepository();

    login = async (
        correo: string,
        password: string,
    ): Promise<{ usuario: UsuarioDocument; token: string }> => {
        const usuario = await this.userRepository.findByEmail(correo);
        if (!usuario) throw new AppError(401, 'Usuario / password no son correctos');
        if (!usuario.estado) throw new AppError(401, 'Estado del usuario: bloqueado');

        const valid = await verifyPassword(usuario.password, password);
        if (!valid) throw new AppError(401, 'Usuario / password no son correctos');

        const token = generarJWT(usuario.id);
        return { usuario, token };
    };

    renewToken = (usuarioId: string): string => generarJWT(usuarioId);

    updateUserPassword = async (
        correo: string,
        password: string,
    ): Promise<{ usuarioId: string; hashedPassword: string }> => {
        const user = await this.userRepository.getPasswordByEmail(correo);
        if (!user) throw new AppError(404, 'Usuario no encontrado');

        const samePassword = await verifyPassword(user.password, password);
        if (samePassword) {
            throw new AppError(409, 'No puedes cambiar la contraseña actual por la misma');
        }

        const hashedPassword = await hashPassword(password);
        await this.userRepository.update(user.id, { password: hashedPassword });

        return { usuarioId: user.id, hashedPassword };
    };
}

export default AuthService;
