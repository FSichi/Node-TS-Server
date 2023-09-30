import { Express } from 'express';

// Importar los enrutadores
import authRouter from './AuthRoutes.ts';
import testRouter from './TestRoutes.ts';
import userRouter from './UserRoutes.ts';

// Enrutadores
const routerPaths = {
    AUTH: authRouter,
    USER: userRouter,
    TEST: testRouter,
}

// Direcciones de la API
const routesPaths = {
    AUTH: '/api/auth',
    USER: '/api/users',
    TEST: '/api/test',
}

export const loadRouters = (app: Express) => {
    app.use(routesPaths.AUTH, routerPaths.AUTH);
    app.use(routesPaths.USER, routerPaths.USER);
    app.use(routesPaths.TEST, routerPaths.TEST);
};

export default loadRouters;