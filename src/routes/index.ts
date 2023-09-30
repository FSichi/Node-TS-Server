import { Express } from 'express';

// Importar los enrutadores
import testRouter from './TestRoutes.ts';

// Enrutadores
const routerPaths = {
    TEST: testRouter,
}

// Direcciones de la API
const routesPaths = {
    TEST: '/api/test',
}

export const loadRouters = (app : Express) => {
    app.use(routesPaths.TEST, routerPaths.TEST);
};

export default loadRouters;