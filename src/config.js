// src/config.js

import dotenv from 'dotenv';
dotenv.config();

// Configuracin para que la Pasarela de Pago pueda acceder a la DB
export const dbConfigPasarela = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE, // La base de datos 'Banco'
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

// Otras configuraciones del sistema
export const BANK_API_URL = process.env.BANK_API_URL;