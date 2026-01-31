import { StatusCodes } from "http-status-codes";
import Notification from "../model/Notification";
import { TypeCreateNotification } from "../schema";
import { ApiError, getUser, logger } from "../shared";
import User from "../shared/models/User";
import mongoose, { ObjectId } from "mongoose";


// ! AS OF NOW , I AM CURRENLTY MAKING THIS SERVICE SUITABLE FOR SENDING INVITATION OF THE GROUP-PRODUCTIVITY-TIMER FROM THE ADMIN TO OTHER USERS INVITED AND WILL ADD OR MAKE IT MORE PRONE FOR OTHER THINGS


// ? I am able to send notification but user has to accept it for which I will create a invitation accepting API !

// ? In the frontend, in the notifications area there will be the invitation notification and people can accept or reject it (I will call accepting and rejecting api from there on !);

export const notificationServices = {
    // The service layer exist so your business logic can survice without https
    // * CREATE NOTIFICATION
    createNotification: async (data: TypeCreateNotification) => {
        const { notificationType, topic, message, from, to } = data;

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
    }
}