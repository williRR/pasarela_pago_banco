import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT ;
const BANK_API_URL = process.env.BANK_API_URL;
export { PORT, BANK_API_URL };