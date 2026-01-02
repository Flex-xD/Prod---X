import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT  || 10000

app.listen(PORT , () => {
    console.info(`Notification-Service 🔔 running on PORT : ${PORT}`);
})