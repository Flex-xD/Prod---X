import { Router } from "express";
import { createNotification, sendNotification } from "../controller";

const notificationRouter = Router();

notificationRouter.post("/create-notification", createNotification);
notificationRouter.post("/send-notification", sendNotification);

export default notificationRouter;