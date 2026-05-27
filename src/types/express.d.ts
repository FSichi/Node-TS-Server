import { UsuarioDocument } from '../database/models/Usuario.js';

declare global {
    namespace Express {
        interface Request {
            usuario?: UsuarioDocument | null;
        }
    }
}

export {};
