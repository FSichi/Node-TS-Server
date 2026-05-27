import argon2 from 'argon2';

export const hashPassword = (password: string): Promise<string> => argon2.hash(password);

export const verifyPassword = (hash: string, password: string): Promise<boolean> =>
    argon2.verify(hash, password);
