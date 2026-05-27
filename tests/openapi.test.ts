import './setup.js';
import { describe, expect, it } from 'vitest';

describe('openapi document generation', () => {
    it('registers routes and produces valid OpenAPI v3 document', async () => {
        await import('../src/routes/UserRoutes.js');
        await import('../src/routes/AuthRoutes.js');
        await import('../src/routes/TestRoutes.js');

        const { generateOpenApiDocument } = await import('../src/openapi/document.js');
        const doc = generateOpenApiDocument();

        expect(doc.openapi).toBe('3.0.0');
        expect(doc.info.title).toBe('Node-TS-Server API');
        expect(doc.paths).toBeDefined();

        const paths = Object.keys(doc.paths!);
        expect(paths).toContain('/api/users/');
        expect(paths).toContain('/api/users/{userId}');
        expect(paths).toContain('/api/auth/login');
        expect(paths).toContain('/api/auth/renew');
        expect(paths).toContain('/api/test/');

        expect(doc.components?.securitySchemes?.bearerAuth).toBeDefined();
    });
});
