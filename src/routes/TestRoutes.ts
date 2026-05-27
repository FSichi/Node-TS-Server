import { Router } from 'express';
import TestController from '../controllers/TestController.js';
import { requireAuth, requireAdmin, validate } from '../middlewares/index.js';
import { defineRoute } from '../openapi/defineRoute.js';
import { createTestSchema } from '../schemas/test.schema.js';
import { paginationQuerySchema } from '../schemas/pagination.schema.js';

const router = Router();
const prefix = '/api/test';
const controller = new TestController();
const tags = ['Test'];

defineRoute(router, prefix, {
    method: 'get',
    path: '/',
    summary: 'List test items (paginated)',
    tags,
    requireAuth: true,
    query: paginationQuerySchema,
    middlewares: [requireAuth, requireAdmin, validate({ query: paginationQuerySchema })],
    handler: controller.getAll,
});

defineRoute(router, prefix, {
    method: 'post',
    path: '/',
    summary: 'Create test item',
    tags,
    body: createTestSchema,
    middlewares: [validate({ body: createTestSchema })],
    handler: controller.create,
});

export default { router, prefix };
