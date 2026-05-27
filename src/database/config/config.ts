import mongoose from 'mongoose';
import { config } from '../../config/env.js';
import { logger } from '../../logger/index.js';

export const dbConnection = async (): Promise<void> => {
    try {
        await mongoose.connect(config.DATABASE_URL);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error({ err }, 'MongoDB connection error');
        throw new Error('Failed to initialize database connection');
    }
};
