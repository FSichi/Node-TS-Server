import jwt from 'jsonwebtoken';
const { sign } = jwt;

// export const generarJWT = async (uid: string) => {

export const generarJWT = (uid: string): string => {

    if (!uid) {
        throw new Error('El UID no puede estar vacío');
    }

    try {
        const payload = { uid };
        const expiresIn = '2h';
        const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY || '';

        return sign(payload, secretOrPrivateKey, { expiresIn });

    } catch (error) {
        throw new Error('Error al generar el JWT');
    }
};

export default generarJWT;