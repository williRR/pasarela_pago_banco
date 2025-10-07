
// src/services/bankService.js
import axios from "axios";
import { BANK_API_URL } from "../config.js";
import { registerInitialTransaction, updateTransactionStatus } from "../models/transactions.js";

/**
 * Procesa un pago completo a través de la pasarela y el banco.
 * @param {object} params
 * @param {string} params.merchantId
 * @param {number} params.amount
 * @param {string} params.cardNumber
 * @param {string} params.expDate
 * @param {string} params.cvv
 * @returns {Promise<{success: boolean, transactionId: number, message: string, errorCode?: string}>}
 */
export async function processPayment({ merchantId, amount, cardNumber, expDate, cvv }) {
  let pasarelaTxId = null;

  try {
    // 1️⃣ Registrar transacción inicial
    pasarelaTxId = await registerInitialTransaction({ merchantId, amount, cardNumber,});

    // 2️⃣ Llamada segura al banco
    const bankResponse = await axios.post(
      `${BANK_API_URL}/autorizar`,
      {
        tarjcodigo: cardNumber,
        monto: amount,
        tarjfecha: expDate,
        tarjcvv: cvv,
      },
      {
        timeout: 5000,
        validateStatus: (status) => status < 500,
      }
    );

    const { status, mensaje, cuentacodigo, codigo } = bankResponse.data;

    // 3️⃣ Mapear estado del banco a interno
    const statusMap = {
      APROBADO: "SUCCESS",
      RECHAZADO: "FAILED",
      ERROR: "ERROR",
    };
    const finalStatus = statusMap[status] || "UNKNOWN";

    // 4️⃣ Actualizar en BD
    await updateTransactionStatus({
      transactionId: pasarelaTxId,
      status: finalStatus,
      message: mensaje,
      cuentaReferencia: cuentacodigo || null,
    });

    return {
      success: finalStatus === "SUCCESS",
      transactionId: pasarelaTxId,
      message: mensaje,
      errorCode: codigo || null,
    };
  } catch (error) {
    console.error("Fallo durante la llamada al banco:", error.message);

    if (error.response?.data) {
      const safeData = { ...error.response.data };
      if (safeData.tarjcodigo) safeData.tarjcodigo = "****" + safeData.tarjcodigo.slice(-4);
      console.error("Respuesta del Banco (data):", safeData);
    } else {
      console.error("Sin respuesta del Banco.");
    }

    if (pasarelaTxId) {
      try {
        await updateTransactionStatus({
          transactionId: pasarelaTxId,
          status: "FALLIDO",
          message: error.message,
        });
      } catch (dbErr) {
        console.error("No se pudo actualizar estado en BD:", dbErr.message);
      }
    }

    return {
      success: false,
      transactionId: pasarelaTxId,
      message: error.message,
      errorCode: error.response?.data?.codigo || "BANK_ERROR",
    };
  }
}
