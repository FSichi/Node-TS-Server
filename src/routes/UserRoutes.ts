import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { requireAuth, requireAdmin, validate } from '../middlewares/index.js';
import { defineRoute } from '../openapi/defineRoute.js';
import {
    createUserSchema,
    updateUserSchema,
    changeStatusSchema,
    userIdParamsSchema,
    userResponseSchema,
} from '../schemas/user.schema.js';
import { paginationQuerySchema } from '../schemas/pagination.schema.js';

const router = Router();
const prefix = '/api/users';
const controller = new UserController();
const tags = ['Users'];

defineRoute(router, prefix, {
    method: 'get',
    path: '/',
    summary: 'List all users (paginated)',
    tags,
    requireAuth: true,
    query: paginationQuerySchema,
    response: userResponseSchema.array(),
    middlewares: [requireAuth, requireAdmin, validate({ query: paginationQuerySchema })],
    handler: controller.getAllUsers,
});

defineRoute(router, prefix, {
    method: 'get',
    path: '/:userId',
    summary: 'Get user by ID',
    tags,
    requireAuth: true,
    params: userIdParamsSchema,
    response: userResponseSchema,
    middlewares: [requireAuth, requireAdmin, validate({ params: userIdParamsSchema })],
    handler: controller.getUserById,
});

defineRoute(router, prefix, {
    method: 'post',
    path: '/',
    summary: 'Create a new user',
    tags,
    body: createUserSchema,
    response: userResponseSchema,
    middlewares: [validate({ body: createUserSchema })],
    handler: controller.createUser,
});

defineRoute(router, prefix, {
    method: 'put',
    path: '/',
    summary: 'Update user name',
    tags,
    requireAuth: true,
    body: updateUserSchema,
    response: userResponseSchema,
    middlewares: [requireAuth, requireAdmin, validate({ body: updateUserSchema })],
    handler: controller.updateUser,
});

defineRoute(router, prefix, {
    method: 'put',
    path: '/change-status',
    summary: 'Change user enabled status',
    tags,
    requireAuth: true,
    body: changeStatusSchema,
    response: userResponseSchema,
    middlewares: [requireAuth, requireAdmin, validate({ body: changeStatusSchema })],
    handler: controller.changeUserStatus,
});

export default { router, prefix };
