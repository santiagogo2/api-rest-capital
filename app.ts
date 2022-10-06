import dotenv from 'dotenv';
import Server from './models/server';

// Configurar dot.env
dotenv.config();

// Configuración del servidor
const server = new Server();

server.listen();