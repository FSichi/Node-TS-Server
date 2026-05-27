import { Express } from 'express';
import userRoutes from './UserRoutes.js';
import authRoutes from './AuthRoutes.js';
import testRoutes from './TestRoutes.js';

const allRoutes = [authRoutes, userRoutes, testRoutes];

export const loadRouters = (app: Express): void => {
    allRoutes.forEach(({ prefix, router }) => app.use(prefix, router));
};
