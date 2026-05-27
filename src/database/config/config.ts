import mongoose from 'mongoose';
import { config } from '../../config/env.js';
import { logger } from '../../logger/index.js';

const connectionString = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_CLUSTER}/${config.DB_NAME}?retryWrites=true&w=majority`;

export const dbConnection = async (): Promise<void> => {
    try {
        await mongoose.connect(connectionString);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error({ err }, 'MongoDB connection error');
        throw new Error('Failed to initialize database connection');
    }
};
