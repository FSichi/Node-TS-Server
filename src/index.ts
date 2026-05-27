import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/env.js';
import { logger } from './logger/index.js';
import { dbConnection } from './database/config/config.js';
import { loadRouters } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/index.js';
import { generateOpenApiDocument } from './openapi/document.js';

const app = express();

await dbConnection();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    }),
);
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/health', (_req, res) => {
    res.json({ status: 'OK' });
});

loadRouters(app);

const openApiDoc = generateOpenApiDocument();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
app.get('/openapi.json', (_req, res) => {
    res.json(openApiDoc);
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
    logger.info(`Swagger docs available at http://localhost:${config.PORT}/docs`);
});
