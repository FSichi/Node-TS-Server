import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnection } from './database/config/config.ts';

import { notFoundURL, handleJsonSyntaxError } from './middlewares/index.ts';
import { loadRouters } from './routes/index.ts';

dotenv.config();
const app = express();

// CONEXION A DB
dbConnection();

// Middlewares
app.use(json());
app.use(cors());
// app.use((error: any, res: Response, next: NextFunction) => handleJsonSyntaxError(res, next, error));

// Cargar los enrutadores
loadRouters(app);

// Direccion por Defecto
app.get('/', (_req: Request, res: Response) => {
    res.send('Ingenieria de Software - Backend - Default Route');
})

// Middleware para manejar URL no encontradas
app.use(notFoundURL);
// app.use((req, res, next) => notFoundURL({ req, res, next }));

// Escuchar Peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});