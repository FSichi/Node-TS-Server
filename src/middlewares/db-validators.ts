import { UsuarioModel } from '../database/models/index.ts'

// export const esRoleValido = async (rol = 'PARTICULAR_ROLE') => {
//     const existeRol = await RoleModel.findOne({ rol });
//     if (!existeRol) {
//         throw new Error(`El rol ${rol} no está registrado en la BD`);
//     }
// }

export const emailExiste = async (correo: string) => {
    const existeEmail = await UsuarioModel.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}


export default {
    // esRoleValido,
    emailExiste,
}