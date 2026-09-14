import { Router } from "express";
import { createNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead, sendNotification } from "../controller";
import { internalServiceAuth } from "../middleware";

const notificationRouter = Router();

notificationRouter.post("/create-notification", internalServiceAuth, createNotification);
notificationRouter.post("/send-notification", internalServiceAuth, sendNotification);

notificationRouter.get("/:userId", getNotifications);
notificationRouter.patch("/:notificationId/read", markNotificationAsRead);
notificationRouter.patch("/read-all/:userId", markAllNotificationsAsRead);

export default notificationRouter;