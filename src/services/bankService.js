import axios from "axios";
import { saveTransaction } from "../models/transactions.js";

// URL de tu banco ficticio (API)
const BANK_API_URL = process.env.BANK_API_URL || "http://localhost:3000";

export async function processPayment({ merchantId, amount, cardNumber, expDate, cvv }) {
  try {
    // Petición al banco ficticio
    const response = await axios.post(`${BANK_API_URL}/validate-payment`, {
      merchantId,
      amount, 
      cardNumber,
      expDate,
      cvv
    });

    // Guardar en la BD de la pasarela (registro propio de transacciones)
    await saveTransaction({
      merchantId,
      amount,
      status: response.data.success ? "success" : "failed",
      bankTransactionId: response.data.transactionId || null
    });

    return response.data;

  } catch (error) {
    console.error("Error comunicando con banco:", error.message);
    return { success: false, message: "Error conectando con banco" };
  }
}
