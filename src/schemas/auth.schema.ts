import { z } from 'zod';

export const loginSchema = z.object({
    correo: z.string().email('El correo es obligatorio y debe tener formato válido'),
    password: z.string().min(6).max(15),
});

export const changePasswordSchema = z.object({
    correo: z.string().email(),
    password: z.string().min(6).max(15),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
