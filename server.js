import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import paymentRoutes from "./src/routes/payments.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());

// Rutas
app.use("/api/payments", paymentRoutes);

// Puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Pasarela de pago corriendo en http://localhost:${PORT}`);
});
