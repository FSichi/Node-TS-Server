import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry.js';

registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'apiKey',
    in: 'header',
    name: 'x-token',
});

export const generateOpenApiDocument = () => {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title: 'Node-TS-Server API',
            version: '0.1.0',
            description: 'Template Express + TypeScript backend',
        },
        servers: [{ url: 'http://localhost:4000' }],
    });
};
