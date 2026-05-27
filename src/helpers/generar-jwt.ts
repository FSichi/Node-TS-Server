import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generarJWT = (uid: string): string => {
    if (!uid) throw new Error('El UID no puede estar vacío');
    return jwt.sign({ uid }, config.SECRETORPRIVATEKEY, { expiresIn: '2h' });
};
