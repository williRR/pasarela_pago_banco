// src/config.js (en tu Pasarela de Pago)

import dotenv from 'dotenv';
dotenv.config();

export const dbConfigPasarela = {
    // ... tus otras variables de conexin (user, password, server, database)
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};


