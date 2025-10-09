import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import paymentRoutes from "./src/routes/payments.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());

// Health check endpoint para Fly.io
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "Pasarela de Pago Banco"
  });
});

// Endpoint raíz
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "API Pasarela de Pago Banco - Funcionando correctamente",
    version: "1.0.0",
    endpoints: ["/api/payments", "/health"]
  });
});

// Rutas
app.use("/api/payments", paymentRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Pasarela de pago corriendo en el puerto ${PORT}`);
});
