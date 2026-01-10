import { Router } from "express";
import { sendNotification } from "../controller";

const notificationRouter = Router();

notificationRouter.post("/send-notification", sendNotification);

export default notificationRouter;