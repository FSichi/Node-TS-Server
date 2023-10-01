import { UsuarioDocument } from '../database/models/Usuario.ts';
import { handleDatabaseError } from '../messages/ErrorHandlers.ts';
import { checkValidPassword } from './bcryptHelpers.ts';

interface IObject {
    objectId?: string;
    object: any;
    objectType: string;
    type: boolean;
}


export const checkUserStatusForLogin = (user: UsuarioDocument, password: string) => {

    let userStatus = true;
    let error = { status: 401, message: '' }

    // Verificar si existe un usuario con ese email existe
    if (user === null || typeof user == 'undefined' || !user) {
        userStatus = false;
        error.message = 'Usuario / Password no son correctos'
    }

    // SI el usuario esta deshabilitado
    if ((user !== null) && !user.estado) {
        userStatus = false;
        error.message = 'Estado del Usuario: Usuario Bloqueado'
    }

    // Verificar la contraseña - Hash con BcryptJs
    if (user !== null) {

        console.log('Entre 3');

        const validPassword = checkValidPassword(password, user.password);
        if (!validPassword) {
            userStatus = false;
            error.message = 'Usuario / Password no son correctos'
        }
    }

    return { userStatus, error };
}

export const checkIfObjectExists = ({ objectId = '', object, type, objectType }: IObject) => {

    if (object === null) {
        handleDatabaseError({ status: 407, error: `No Existe el/la ${objectType} que estas buscando` });
    }

    if ((!type) ? (!object) : (object.length === 0)) {
        handleDatabaseError({ status: 407, error: `No Existe ${objectType} con id: ${objectId}` });
    }

};

export const isValidMongoDBID = (id: string) => {

    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    objectIdPattern.test(id);

    if (!objectIdPattern.test(id)) {
        throw new Error('El ID proporcionado no es válido');
    }

}