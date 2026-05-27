import mongoose from 'mongoose';
import { config } from './config/env.js';
import { logger } from './logger/index.js';
import { dbConnection } from './database/config/config.js';
import { createApp } from './app.js';

const main = async () => {
    await dbConnection();
    const app = createApp();

    const server = app.listen(config.PORT, () => {
        logger.info(`Server running on port ${config.PORT}`);
        logger.info(`Swagger docs at http://localhost:${config.PORT}/docs`);
    });

    const shutdown = async (signal: string) => {
        logger.info({ signal }, 'Shutdown signal received');
        await new Promise<void>(resolve => {
            server.close(err => {
                if (err) logger.error({ err }, 'Error closing HTTP server');
                else logger.info('HTTP server closed');
                resolve();
            });
        });
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
        process.exit(0);
    };

    process.on('SIGTERM', () => {
        void shutdown('SIGTERM');
    });
    process.on('SIGINT', () => {
        void shutdown('SIGINT');
    });
};

await main();
