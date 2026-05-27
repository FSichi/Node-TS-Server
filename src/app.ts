import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

import { config } from './config/env.js';
import { logger } from './logger/index.js';
import { loadRouters } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/index.js';
import { generateOpenApiDocument } from './openapi/document.js';

export const createApp = (): Express => {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: config.CORS_ORIGINS === '*' ? true : config.CORS_ORIGINS }));
    app.use(compression());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
        }),
    );
    app.use(express.json({ limit: config.BODY_LIMIT }));
    app.use(
        pinoHttp({
            logger,
            genReqId: (req, res) => {
                const incoming = req.headers['x-request-id'];
                const id = typeof incoming === 'string' ? incoming : randomUUID();
                res.setHeader('x-request-id', id);
                return id;
            },
        }),
    );

    app.get('/live', (_req, res) => {
        res.json({ data: { status: 'live' } });
    });

    app.get('/ready', (_req, res) => {
        const ready = mongoose.connection.readyState === 1;
        res.status(ready ? 200 : 503).json({
            data: { status: ready ? 'ready' : 'not-ready' },
        });
    });

    loadRouters(app);

    const openApiDoc = generateOpenApiDocument();
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
    app.get('/openapi.json', (_req, res) => {
        res.json(openApiDoc);
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
