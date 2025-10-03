// src/services/bankService.js
import axios from "axios";
import { BANK_API_URL } from "../config.js";
import { registerInitialTransaction, updateTransactionStatus } from "../models/transactions.js";

export async function processPayment({ merchantId, amount, cardNumber, expDate, cvv }) {
    let pasarelaTxId = null; // ID de transaccin de la Pasarela

    try {
        // 1. Registrar la transaccin como PENDIENTE
        pasarelaTxId = await registerInitialTransaction({ merchantId, amount, cardNumber });

        // 2. Peticin al banco ficticio
        const bankResponse = await axios.post(`${BANK_API_URL}/autorizar`, {
            tarjcodigo: cardNumber, // Usamos el nombre de campo que espera la API de Banco
            monto: amount,
            // (Opcional) puedes incluir emplcodigo y tipocodigo si el banco los necesita
        });

        // 3. Respuesta EXITOSA del BANCO (HTTP 200)
        const finalStatus = bankResponse.data.status; // 'APROBADO'
        const finalMessage = bankResponse.data.mensaje;
        const cuentaReferencia = bankResponse.data.cuentacodigo || null; // Si el banco devuelve la cuenta afectada

        // 4. Actualizar el estado final en la Pasarela (APROBADO)
        await updateTransactionStatus({
            transactionId: pasarelaTxId,
            status: finalStatus,
            message: finalMessage,
            cuentaReferencia: cuentaReferencia
        });

        return {
            success: true,
            transactionId: pasarelaTxId,
            message: finalMessage
        };

    } catch (error) {
        // Manejar RECHAZOS (HTTP 400 del banco) o FALLOS (HTTP 500/Red)
        let finalStatus = 'FALLIDO';
        let finalMessage = "Error de red o servidor.";

        if (error.response && error.response.status === 400) {
            // El banco rechaz el pago por fondos insuficientes, etc.
            finalStatus = 'RECHAZADO';
            finalMessage = error.response.data.mensaje; 
        }

        // 4b. Actualizar el estado como RECHAZADO o FALLIDO
        if (pasarelaTxId) {
            await updateTransactionStatus({
                transactionId: pasarelaTxId,
                status: finalStatus,
                message: finalMessage
            });
        }
        
        return { 
            success: false, 
            message: finalMessage, 
            transactionId: pasarelaTxId 
        };
    }
}