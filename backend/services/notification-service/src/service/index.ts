import { StatusCodes } from "http-status-codes";
import Notification from "../model/Notification";
import { TypeCreateNotification } from "../schema";
import { ApiError, getUser } from "../shared";
import mongoose from "mongoose";

export const notificationServices = {
    createNotification: async (data: TypeCreateNotification) => {
        const notification = await Notification.create({ ...data });
        return notification;
    },

    sendNotification: async (notificationReceivingUserId: mongoose.Types.ObjectId, notificationId: mongoose.Types.ObjectId) => {
        const notificationReceivingUser = await getUser(notificationReceivingUserId);
        const notification = await Notification.findById(notificationId);
        if (!notification) throw ApiError(StatusCodes.NOT_FOUND, "Notification to be sent not found !");
        notificationReceivingUser.notifications.push(notificationId);
        await notificationReceivingUser.save();
        return notification;
    },

    getNotificationsForUser: async (userId: mongoose.Types.ObjectId, page = 1, limit = 15) => {
        const filter = { to: userId };

        const allForUser = await Notification.find(filter).sort({ createdAt: -1 }).populate("from", "username avatar").lean();

        const visible = allForUser.filter((n) => {
            if (n.notificationType !== "group-timer-request") return true;
            const myResponse = n.invitationResponses?.find((r: any) => r.userId.toString() === userId.toString());
            return !myResponse || myResponse.status === "pending";
        });

        const total = visible.length;
        const paginated = visible.slice((page - 1) * limit, page * limit);
        const unreadCount = visible.filter((n) => !n.readBy?.some((id: any) => id.toString() === userId.toString())).length;

        return { notifications: paginated, hasMore: page * limit < total, unreadCount };
    },

    markAsRead: async (notificationId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        return Notification.findByIdAndUpdate(notificationId, { $addToSet: { readBy: userId } }, { new: true });
    },

    markAllAsRead: async (userId: mongoose.Types.ObjectId) => {
        return Notification.updateMany({ to: userId, readBy: { $ne: userId } }, { $addToSet: { readBy: userId } });
    },

    updateInvitationResponseByGroupTimer: async (
        groupTimerId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId,
        status: "accepted" | "declined"
    ) => {
        const updateExisting = await Notification.updateOne(
            { "invitation.groupTimerId": groupTimerId, to: userId, "invitationResponses.userId": userId },
            { $set: { "invitationResponses.$.status": status }, $addToSet: { readBy: userId } }
        );

        if (updateExisting.matchedCount === 0) {
            await Notification.updateOne(
                { "invitation.groupTimerId": groupTimerId, to: userId, "invitationResponses.userId": { $ne: userId } },
                { $push: { invitationResponses: { userId, status } }, $addToSet: { readBy: userId } }
            );
        }
    },
};