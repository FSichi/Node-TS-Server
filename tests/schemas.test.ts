import './setup.js';
import { describe, expect, it } from 'vitest';
import { createUserSchema, userIdParamsSchema } from '../src/schemas/user.schema.js';
import { loginSchema } from '../src/schemas/auth.schema.js';
import { UserRoles } from '../src/database/enums/index.js';

describe('user schemas', () => {
    it('createUserSchema accepts valid input', () => {
        const result = createUserSchema.safeParse({
            nombre: 'Facu',
            password: '123456',
            correo: 'facu@example.com',
            rol: UserRoles.USER,
        });
        expect(result.success).toBe(true);
    });

    it('createUserSchema rejects invalid email', () => {
        const result = createUserSchema.safeParse({
            nombre: 'Facu',
            password: '123456',
            correo: 'not-an-email',
            rol: UserRoles.USER,
        });
        expect(result.success).toBe(false);
    });

    it('createUserSchema rejects short password', () => {
        const result = createUserSchema.safeParse({
            nombre: 'Facu',
            password: '123',
            correo: 'facu@example.com',
            rol: UserRoles.USER,
        });
        expect(result.success).toBe(false);
    });

    it('userIdParamsSchema accepts valid ObjectId', () => {
        const result = userIdParamsSchema.safeParse({ userId: '507f1f77bcf86cd799439011' });
        expect(result.success).toBe(true);
    });

    it('userIdParamsSchema rejects invalid ObjectId', () => {
        const result = userIdParamsSchema.safeParse({ userId: 'not-an-objectid' });
        expect(result.success).toBe(false);
    });
});

describe('auth schemas', () => {
    it('loginSchema accepts valid input', () => {
        const result = loginSchema.safeParse({
            correo: 'facu@example.com',
            password: '123456',
        });
        expect(result.success).toBe(true);
    });

    it('loginSchema rejects missing password', () => {
        const result = loginSchema.safeParse({ correo: 'facu@example.com' });
        expect(result.success).toBe(false);
    });
});
