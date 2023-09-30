import mongoose from 'mongoose';
import dotenv from 'dotenv';

const { connect, connection } = mongoose;
dotenv.config()

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbCluster = process.env.DB_CLUSTER;

// Construir la cadena de conexión
const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;

export const dbConnection = () => {

    return new Promise((resolve, reject) => {

        connect(connectionString);

        connection.on('connected', () => {
            console.log('DB Mongoose Conectada con Éxito');
            resolve(void 0);
        });

        connection.on('error', (error) => {
            console.error(error);
            reject(new Error('Error al inicializar la base de datos'));
        });

    });
};

export default dbConnection;