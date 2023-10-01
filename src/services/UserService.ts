import { IUsuarioParams, UsuarioDocument } from "../database/models/Usuario.ts";
import { encryptPassword } from "../helpers/bcryptHelpers.ts";
import { checkIfObjectExists, isValidMongoDBID } from "../helpers/helperFunctions.ts";
import { handleProcessError } from "../messages/ErrorHandlers.ts";
import UserRepository from "../repository/UserRepository.ts";


class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public getAllUsers = async (): Promise<UsuarioDocument[] | undefined> => {
        try {
            const listOfUsers = await this.userRepository.getAll();
            return listOfUsers;
        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    public getUserById = async (userId: string): Promise<UsuarioDocument | undefined | null> => {
        try {

            isValidMongoDBID(userId);

            const user = await this.userRepository.getById(userId);
            checkIfObjectExists({ objectId: userId, object: user, type: false, objectType: 'Usuario' });

            return user;

        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    public createUser = async (data: IUsuarioParams): Promise<UsuarioDocument | undefined> => {
        try {

            let usuarioToDB = data;
            usuarioToDB.password = encryptPassword(data.password);

            const newUser = await this.userRepository.create(usuarioToDB);
            return newUser;
        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    public updateUser = async (data: { _id: string, nombre: string }): Promise<UsuarioDocument | undefined | null> => {

        const { _id, nombre } = data

        try {

            await this.getUserById(_id);

            const user = await this.userRepository.update(_id, { nombre: nombre });
            return user;

        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    public changeUserStatus = async (data: { _id: string, estado: boolean }): Promise<UsuarioDocument | undefined | null> => {

        const { _id, estado } = data

        try {

            await this.getUserById(_id);

            const user = await this.userRepository.update(_id, { estado: estado });
            return user;

        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

}

export default UserService;