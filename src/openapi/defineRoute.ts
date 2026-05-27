import { Router, RequestHandler } from 'express';
import { AnyZodObject, ZodSchema } from 'zod';
import { registry } from './registry.js';

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteDefinition {
    method: Method;
    path: string;
    summary?: string;
    description?: string;
    tags?: string[];
    body?: ZodSchema;
    params?: AnyZodObject;
    query?: AnyZodObject;
    response?: ZodSchema;
    requireAuth?: boolean;
    middlewares?: RequestHandler[];
    handler: RequestHandler;
}

const expressToOpenApiPath = (path: string): string => path.replace(/:([^/]+)/g, '{$1}');

export const defineRoute = (router: Router, mountPath: string, def: RouteDefinition): void => {
    registry.registerPath({
        method: def.method,
        path: expressToOpenApiPath(mountPath + def.path),
        summary: def.summary,
        description: def.description,
        tags: def.tags,
        security: def.requireAuth ? [{ bearerAuth: [] }] : undefined,
        request: {
            ...(def.body && {
                body: { content: { 'application/json': { schema: def.body } } },
            }),
            ...(def.params && { params: def.params }),
            ...(def.query && { query: def.query }),
        },
        responses: {
            200: {
                description: 'Success',
                ...(def.response && {
                    content: { 'application/json': { schema: def.response } },
                }),
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
            500: { description: 'Internal server error' },
        },
    });

    router[def.method](def.path, ...(def.middlewares ?? []), def.handler);
};
