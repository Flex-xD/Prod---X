import { Router } from "express";
import { createNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead, sendNotification } from "../controller";

const notificationRouter = Router();

notificationRouter.post("/create-notification", createNotification);
notificationRouter.post("/send-notification", sendNotification);
notificationRouter.get("/:userId", getNotifications);
notificationRouter.patch("/:notificationId/read", markNotificationAsRead);
notificationRouter.patch("/read-all/:userId", markAllNotificationsAsRead);

export default notificationRouter;