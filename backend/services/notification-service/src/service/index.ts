import { StatusCodes } from "http-status-codes";
import Notification from "../model/Notification";
import { TypeCreateNotification } from "../schema";
import { ApiError, getUser } from "../shared";


// ! AS OF NOW , I AM CURRENLTY MAKING THIS SERVICE SUITABLE FOR SENDING INVITATION OF THE GROUP-PRODUCTIVITY-TIMER FROM THE ADMIN TO OTHER USERS INVITED AND WILL ADD OR MAKE IT MORE PRONE FOR OTHER THINGS


// ? I am able to send notification but user has to accept it for which I will create a invitation accepting API !

// ? In the frontend, in the notifications area there will be the invitation notification and people can accept or reject it (I will call accepting and rejecting api from there on !);

export const notificationServices = {
    // The service layer exist so your business logic can survice without https
    createNotification: async (data: TypeCreateNotification) => {
        const { notificationType, topic, message, from, to } = data;
        const receivingUser = await getUser(to);
        if (!receivingUser) {
            throw ApiError(StatusCodes.NOT_FOUND, "User to receive notification not found !")
        }
        const notification = await Notification.create({ ...data });
        receivingUser.notifications.push(notification._id);
        await receivingUser.save();
        
        return notification;
    }
}