import { model, Schema, Document } from 'mongoose';
import { UserRoles } from '../enums/index.js';

interface IUsuarioParams {
    nombre: string;
    correo: string;
    password: string;
    rol: UserRoles;
    estado: boolean;
}

interface IUsuario extends Document, IUsuarioParams {
    getUserRol(): string;
}

type UsuarioDocument = Document & IUsuario;

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
        type: String,
        default: UserRoles.USER,
        enum: [UserRoles.ADMIN, UserRoles.USER],
        required: [true, 'El Rol es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

UsuarioSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.password;
    obj.uid = obj._id;
    delete obj._id;
    return obj;
};

UsuarioSchema.methods.getUserRol = function () {
    return this.toObject().rol;
};

const UsuarioModel = model<IUsuario>('Usuario', UsuarioSchema);

export { IUsuarioParams, IUsuario, UsuarioDocument, UsuarioModel };
