import { UsuarioDocument, UsuarioModel } from '../database/models/Usuario.js';
import GenericRepository from './GenericRepository.js';

class UserRepository extends GenericRepository<UsuarioDocument> {
    constructor() {
        super(UsuarioModel);
    }

    findByEmail = (correo: string): Promise<UsuarioDocument | null> =>
        UsuarioModel.findOne({ correo }).exec();

    getPasswordByEmail = (correo: string): Promise<UsuarioDocument | null> =>
        UsuarioModel.findOne({ correo }).select('_id password').exec();
}

export default UserRepository;
