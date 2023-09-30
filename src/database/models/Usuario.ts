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
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
        type: String,
        default: UserRoles.USER,
        enum: [UserRoles.ADMIN, UserRoles.USER],
        required: [true, 'El Rol es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

UsuarioSchema.methods.getUserRol = function () {
    const { rol } = this.toObject();
    return rol;
}

const UsuarioModel = model<IUsuario>('Usuario', UsuarioSchema);

export { IUsuarioParams, IUsuario, UsuarioDocument, UsuarioModel };