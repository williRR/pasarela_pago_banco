
// src/models/transactions.js
import sql from "mssql";
import { dbConfigPasarela } from "../config.js";

/**
 * Inicializa y reutiliza un único pool de conexiones para toda la app.
 */
const poolPromise = sql.connect(dbConfigPasarela);

/**
 * Obtiene una conexión de base de datos compartida.
 * @returns {Promise<sql.ConnectionPool>}
 */
async function getPool() {
  return poolPromise;
}

/**
 * Registra una transacción inicial con estado PENDIENTE.
 * @param {object} params
 * @param {string} params.merchantId
 * @param {number} params.amount
 * @param {string} params.cardNumber
 * @param {string} [params.moneda="USD"]
 * @returns {Promise<number>} ID de la transacción creada
 */
export async function registerInitialTransaction({ merchantId, amount, cardNumber, moneda = "USD" }) {
  if (!merchantId || typeof amount !== "number" || !cardNumber) {
    throw new Error("Parámetros inválidos para registrar la transacción.");
  }

  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("merchantid", sql.VarChar(50), merchantId);
    request.input("monto", sql.Decimal(18, 2), amount);
    request.input("moneda", sql.VarChar(3), moneda);
    request.input("ultimos4", sql.VarChar(4), cardNumber.slice(-4));
    request.output("transaccionid", sql.Int);

    const result = await request.execute("sp_registrarTransaccion");
    return result.output.transaccionid;
  } catch (err) {
    console.error("Error al registrar transacción inicial:", err.message);
    throw new Error("Fallo al guardar la transacción en la base de datos.");
  }
}

/**
 * Actualiza el estado de una transacción (APROBADO, RECHAZADO, FALLIDO, etc.).
 * @param {object} params
 * @param {number} params.transactionId
 * @param {string} params.status
 * @param {string} params.message
 * @param {number|null} [params.cuentaReferencia=null]
 */
export async function updateTransactionStatus({ transactionId, status, message, cuentaReferencia = null }) {
  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("transaccionid", sql.Int, transactionId);
    request.input("nuevoEstado", sql.VarChar(20), status.toUpperCase());
    request.input("mensaje", sql.VarChar(200), message);
    request.input("cuentareferencia", sql.Int, cuentaReferencia);

    await request.execute("sp_actualizarEstadoTransaccion");
  } catch (err) {
    console.error(`Error al actualizar estado de TX ${transactionId}:`, err.message);
  }
}

