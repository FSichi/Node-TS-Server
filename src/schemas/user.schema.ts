import { z } from 'zod';
import { UserRoles } from '../database/enums/index.js';
import { objectIdSchema } from './common.schema.js';

export const createUserSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    password: z.string().min(6, 'El password debe tener entre 6 y 15 caracteres').max(15),
    correo: z.string().email('El correo no es válido'),
    rol: z.nativeEnum(UserRoles),
});

export const updateUserSchema = z.object({
    _id: objectIdSchema,
    nombre: z.string().min(1, 'El nombre es obligatorio'),
});

export const changeStatusSchema = z.object({
    _id: objectIdSchema,
    estado: z.boolean(),
});

export const userIdParamsSchema = z.object({
    userId: objectIdSchema,
});

export const userResponseSchema = z.object({
    uid: z.string(),
    nombre: z.string(),
    correo: z.string().email(),
    rol: z.string(),
    estado: z.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
