import { UsuarioDocument, UsuarioModel } from "../database/models/Usuario.ts";
import { handleDatabaseError } from "../messages/ErrorHandlers.ts";
import GenericRepository from "./GenericRepository.ts";

class UserRepository extends GenericRepository<UsuarioDocument>{

    constructor() {
        super(UsuarioModel);
    }

    async getUserPassword(correo: string) {
        try {
            const user = await UsuarioModel.findOne({ correo: correo }).select('_id password');
            return user;
        } catch (error) {
            handleDatabaseError({ status: (error as any).status || 500, error: (error as any).message || error });
        }
    }


}

export default UserRepository;