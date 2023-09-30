import express, { json, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { dbConnection } from './database/config/config.ts';
import { loadRouters } from './routes/index.ts';
import { notFoundURL} from './middlewares/index.ts';

dotenv.config();
const app = express();

// CONEXION A DB
dbConnection();

// Middlewares
app.use(cors());
// app.use(handleJsonSyntaxError);
app.use(json());

// Cargar los enrutadores
loadRouters(app);

// Direccion por Defecto
app.get('/', (_req: Request, res: Response) => {
    res.send('Ingenieria de Software - Backend - Default Route');
})

// Middleware para manejar URL no encontradas
app.use(notFoundURL);

// Escuchar Peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});