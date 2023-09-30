import { handleDatabaseError } from '../messages/ErrorHandlers.ts';

interface IObject {
    objectId?: string;
    object: any;
    objectType: string;
    type: boolean;
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