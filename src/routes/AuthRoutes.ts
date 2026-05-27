import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { requireAuth, validate } from '../middlewares/index.js';
import { defineRoute } from '../openapi/defineRoute.js';
import { loginSchema, changePasswordSchema } from '../schemas/auth.schema.js';

const router = Router();
const prefix = '/api/auth';
const controller = new AuthController();
const tags = ['Auth'];

defineRoute(router, prefix, {
    method: 'post',
    path: '/login',
    summary: 'Login with email + password',
    tags,
    body: loginSchema,
    middlewares: [validate({ body: loginSchema })],
    handler: controller.login,
});

defineRoute(router, prefix, {
    method: 'get',
    path: '/renew',
    summary: 'Renew JWT token',
    tags,
    requireAuth: true,
    middlewares: [requireAuth],
    handler: controller.renewToken,
});

defineRoute(router, prefix, {
    method: 'put',
    path: '/change-password',
    summary: 'Change user password',
    tags,
    body: changePasswordSchema,
    middlewares: [validate({ body: changePasswordSchema })],
    handler: controller.updateUserPassword,
});

export default { router, prefix };
