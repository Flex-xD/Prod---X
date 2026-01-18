import { StatusCodes } from "http-status-codes";
import Notification from "../model/Notification";
import { TypeCreateNotification } from "../schema";
import { ApiError, getUser } from "../shared";
import User from "../shared/models/User";


// ! AS OF NOW , I AM CURRENLTY MAKING THIS SERVICE SUITABLE FOR SENDING INVITATION OF THE GROUP-PRODUCTIVITY-TIMER FROM THE ADMIN TO OTHER USERS INVITED AND WILL ADD OR MAKE IT MORE PRONE FOR OTHER THINGS


// ? I am able to send notification but user has to accept it for which I will create a invitation accepting API !

// ? In the frontend, in the notifications area there will be the invitation notification and people can accept or reject it (I will call accepting and rejecting api from there on !);

export const notificationServices = {
    // The service layer exist so your business logic can survice without https
    createNotification: async (data: TypeCreateNotification) => {
        const { notificationType, topic, message, from, to } = data;

        const notification = await Notification.create({ ...data });

        return notification;
    },
    sendNotification: async (invitedUsersId: string[]) => {
        const users  = await User.find({_id:{$in:invitedUsersId}});
        
    }
}