import UserRepository from "../repository/UserRepository.ts";
import { handleProcessError } from "../messages/ErrorHandlers.ts";
import { checkIfObjectExists, checkUserStatusForLogin, comparePassword, encryptPassword, generarJWT } from "../helpers/index.ts";

class AuthService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public checkStatusForLogin = async (correo: string, password: string): Promise<any> => {
        try {
            const usuario = await this.userRepository.getOne({ correo: correo });

            const { userStatus, error } = checkUserStatusForLogin(usuario!, password);

            console.log(userStatus);

            if (!userStatus) {
                return handleProcessError({ status: error.status, error: error.message || '' });
            }

            const token = generarJWT(usuario!.id);
            return { usuario, token };

        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    public renewToken = async (usuarioId: string): Promise<string | undefined> => {
        try {
            const token = generarJWT(usuarioId);
            return token;
        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    public updateUserPassword = async (correo: string, password: string): Promise<any> => {
        try {
            const user = await this.userRepository.getUserPassword(correo);

            checkIfObjectExists({ object: user, type: false, objectType: 'Usuario' });

            const samePassword = await comparePassword({ currentPassword: user!.password, newPassword: password });
            if (samePassword) {
                handleProcessError({ status: 401, error: 'No puedes cambiar la contraseña actual por la misma' });
            }

            const hashedPassword = encryptPassword(password);
            const userUpdated = await this.userRepository.update(user!._id, { password: hashedPassword });

            return { userUpdated, hashedPassword };

        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

}

export default AuthService;