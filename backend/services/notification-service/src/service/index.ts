import { StatusCodes } from "http-status-codes";
import Notification from "../model/Notification";
import { TypeCreateNotification } from "../schema";
import { ApiError, getUser, logger } from "../shared";
import mongoose from "mongoose";


export const notificationServices = {
    // The service layer exist so your business logic can survice without https
    // * CREATE NOTIFICATION
    createNotification: async (data: TypeCreateNotification) => {
        // const { notificationType, topic, message, from, to } = data;

        const notification = await Notification.create({ ...data });

        return notification;
    },

    // * SEND NOTIFICATION
    sendNotification: async (notificationReceivingUserId: mongoose.Types.ObjectId, notificationId: mongoose.Types.ObjectId) => {
        const notificationReceivingUser = await getUser(notificationReceivingUserId);
        // await notificationReceivingUser.notifications.push()
        // ? May be later on I can use select to get specified fields for the notification 
        logger.info(`Notification-service accessed !`);
        const notification = await Notification.findById(notificationId)
        if (!notification) {
            throw ApiError(StatusCodes.NOT_FOUND, "Notification  to be sent not found !");
        }
        // ? I am actually sending one notification at a time, rather than sending to multiple users at once by calling this api once
        notificationReceivingUser.notifications.push(notificationId);
        await notificationReceivingUser.save()
        return notification;
    },
    getNotificationsForUser: async (userId: mongoose.Types.ObjectId, page = 1, limit = 15) => {
        const filter = { to: userId };

        const [rawNotifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("from", "username avatar")
                .lean(),
            Notification.countDocuments(filter),
            Notification.countDocuments({ to: userId, readBy: { $ne: userId } }),
        ]);


        const notifications = rawNotifications.filter((n) => {
            if (n.notificationType !== "group-timer-request") return true;
            const myResponse = n.invitationResponses?.find(
                (r: any) => r.userId.toString() === userId.toString()
            );
            return !myResponse || myResponse.status === "pending";
        });

        return {
            notifications,
            hasMore: page * limit < total,
            unreadCount,
        };
    },

    markAsRead: async (notificationId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        return Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { readBy: userId } },
            { new: true }
        );
    },

    markAllAsRead: async (userId: mongoose.Types.ObjectId) => {
        return Notification.updateMany(
            { to: userId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );
    },

    updateInvitationResponseByGroupTimer: async (
        groupTimerId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId,
        status: "accepted" | "declined"
    ) => {
        const updateExisting = await Notification.updateOne(
            {
                "invitation.groupTimerId": groupTimerId,
                to: userId,
                "invitationResponses.userId": userId,
            },
            { $set: { "invitationResponses.$.status": status } }
        );

        if (updateExisting.matchedCount === 0) {
            await Notification.updateOne(
                {
                    "invitation.groupTimerId": groupTimerId,
                    to: userId,
                    "invitationResponses.userId": { $ne: userId },
                },
                { $push: { invitationResponses: { userId, status } } }
            );
        }
    },
}