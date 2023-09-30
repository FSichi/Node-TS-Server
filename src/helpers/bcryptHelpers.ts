import pkg from 'bcryptjs';
const { compareSync, compare, genSaltSync, hashSync } = pkg;

interface IComparePassword {
    currentPassword: string;
    newPassword: string;
}

interface IValidPassword {
    passwordProvided: string;
    passwordHashed: string;
}

export const comparePassword = async ({ currentPassword, newPassword }: IComparePassword): Promise<boolean> => {
    const passwordMatch = await compare(newPassword, currentPassword);
    return passwordMatch;
};

export const encryptPassword = (password: string): string => {
    const salt = genSaltSync();
    return hashSync(password, salt);
};

export const checkValidPassword = ({ passwordProvided, passwordHashed }: IValidPassword): boolean => {
    const validPassword = compareSync(passwordProvided, passwordHashed);
    return validPassword;
}

export default {
    encryptPassword,
    comparePassword,
    checkValidPassword
};