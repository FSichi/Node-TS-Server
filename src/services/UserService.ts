import { IUsuarioParams, UsuarioDocument } from '../database/models/Usuario.js';
import { hashPassword } from '../helpers/passwordHelpers.js';
import { AppError } from '../errors/AppError.js';
import UserRepository from '../repository/UserRepository.js';

class UserService {
    private userRepository = new UserRepository();

    getAllUsers = (): Promise<UsuarioDocument[]> => this.userRepository.getAll();

    getUserById = async (userId: string): Promise<UsuarioDocument> => {
        const user = await this.userRepository.getById(userId);
        if (!user) throw new AppError(404, `No existe usuario con id: ${userId}`);
        return user;
    };

    createUser = async (data: IUsuarioParams): Promise<UsuarioDocument> => {
        const existing = await this.userRepository.findByEmail(data.correo);
        if (existing) throw new AppError(409, `El correo ${data.correo} ya está registrado`);

        return this.userRepository.create({
            ...data,
            password: await hashPassword(data.password),
        });
    };

    updateUser = async (data: { _id: string; nombre: string }): Promise<UsuarioDocument> => {
        await this.getUserById(data._id);
        const updated = await this.userRepository.update(data._id, { nombre: data.nombre });
        if (!updated) throw new AppError(404, `No existe usuario con id: ${data._id}`);
        return updated;
    };

    changeUserStatus = async (data: { _id: string; estado: boolean }): Promise<UsuarioDocument> => {
        await this.getUserById(data._id);
        const updated = await this.userRepository.update(data._id, { estado: data.estado });
        if (!updated) throw new AppError(404, `No existe usuario con id: ${data._id}`);
        return updated;
    };
}

export default UserService;
