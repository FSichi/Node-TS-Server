import { UsuarioDocument, UsuarioModel } from "../database/models/Usuario.ts";
import GenericRepository from "./GenericRepository.ts";

class UserRepository extends GenericRepository<UsuarioDocument>{

    constructor() {
        super(UsuarioModel);
    }

}

export default UserRepository;