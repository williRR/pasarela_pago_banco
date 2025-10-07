
// src/routes/payments.js
import express from "express";
import { processPayment } from "../services/bankService.js";

const router = express.Router();

/**
 * Valida los datos de entrada para /charge.
 */
function validateCharge(req, res, next) {
  const { merchantId, amount, cardNumber, expDate, cvv } = req.body;

  if (!merchantId || typeof merchantId !== "string" || merchantId.trim() === "") {
    return res.status(400).json({ error: "merchantId inválido" });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Monto inválido" });
  }
  if (!/^\d{13,19}$/.test(cardNumber)) {
    return res.status(400).json({ error: "Número de tarjeta inválido" });
  }
  if (!/^\d{2}\/\d{2}$/.test(expDate)) {
    return res.status(400).json({ error: "Formato de expiración inválido (MM/AA)" });
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    return res.status(400).json({ error: "CVV inválido" });
  }

  req.body.cardNumber = cardNumber.replace(/\s+/g, ""); // Sanitizar
  next();
}

/**
 * POST /charge
 * Procesa un pago de comercio electrónico.
 */
router.post("/charge", validateCharge, async (req, res) => {
  try {
    const { merchantId, amount, cardNumber, expDate, cvv } = req.body;
    const result = await processPayment({ merchantId, amount, cardNumber, expDate, cvv });

    if (result.success) {
      return res.json({
        status: "success",
        transactionId: result.transactionId,
        message: result.message,
      });
    }

    return res.status(400).json({
      status: "failed",
      transactionId: result.transactionId,
      message: result.message,
      errorCode: result.errorCode,
    });
  } catch (error) {
    console.error("Error interno en pasarela:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error interno en la pasarela",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
