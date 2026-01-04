import Notification from "../model/Notification";
import { TCreateNotificationInput } from "../schema";

export const notificationServices = {

    // The service layer exist so your business logic can survice without https
    createNotification: async (data:TCreateNotificationInput) => {
        const{notificationType, topic ,message , from , to} = data;
        const notification = await Notification.create({...data});
        // ? work going on . . .
        return notification;
    }
}