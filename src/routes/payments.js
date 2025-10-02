import express from "express";
import { processPayment } from "../services/bankService.js";

const router = express.Router();

/**
 * Endpoint para procesar pagos
 * Este endpoint lo usarían los ecommerce (clientes)
 */
router.post("/charge", async (req, res) => {
  try {
    const { merchantId, amount, cardNumber, expDate, cvv } = req.body;

    if (!merchantId || !amount || !cardNumber || !expDate || !cvv) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Lógica para procesar el pago con tu banco
    const result = await processPayment({ merchantId, amount, cardNumber, expDate, cvv });

    if (result.success) {
      return res.json({
        status: "success",
        transactionId: result.transactionId,
        message: "Pago procesado correctamente"
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: result.message
      });
    }

  } catch (error) {
    console.error("Error en pasarela:", error);
    res.status(500).json({ error: "Error interno en pasarela" });
  }
});

export default router;
