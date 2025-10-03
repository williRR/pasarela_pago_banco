// src/models/transactions.js
import sql from 'mssql';
import { dbConfigPasarela } from '../config.js'; // Usa la configuracin que acabas de crear

/**
 * Llama a sp_registrarTransaccion para guardar el registro inicial (PENDIENTE).
 * @returns {int} Retorna el int_transaccionid generado.
 */
export async function registerInitialTransaction({ merchantId, amount, cardNumber, moneda = 'USD' }) {
    try {
        const pool = await sql.connect(dbConfigPasarela);
        const request = pool.request();
        
        // Asignacin de inputs para el SP
        request.input('merchantid', sql.VarChar(50), merchantId);
        request.input('monto', sql.Decimal(18, 2), amount);
        request.input('moneda', sql.VarChar(3), moneda);
        request.input('ultimos4', sql.VarChar(4), cardNumber.slice(-4));
        request.output('transaccionid', sql.Int);

        await request.execute('sp_registrarTransaccion');

        return request.output.transaccionid;

    } catch (err) {
        console.error("Error al registrar transaccin inicial:", err);
        throw new Error("Fallo al guardar la transaccin en la base de datos.");
    }
}

/**
 * Llama a sp_actualizarEstadoTransaccion para guardar el resultado final del banco.
 */
export async function updateTransactionStatus({ transactionId, status, message, cuentaReferencia = null }) {
    try {
        const pool = await sql.connect(dbConfigPasarela);
        const request = pool.request();
        
        // Asignacin de inputs para el SP
        request.input('transaccionid', sql.Int, transactionId);
        request.input('nuevoEstado', sql.VarChar(20), status.toUpperCase()); 
        request.input('mensaje', sql.VarChar(200), message);
        request.input('cuentareferencia', sql.Int, cuentaReferencia);

        await request.execute('sp_actualizarEstadoTransaccion');

    } catch (err) {
        console.error(`Error al actualizar estado de TX ${transactionId}:`, err);
        // La transaccin del banco ya se complet, no interrumpimos la respuesta final.
    }
}