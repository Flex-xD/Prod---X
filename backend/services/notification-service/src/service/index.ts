import Notification from "../model/Notification";
import { TCreateNotificationInput } from "../schema";

export const notificationServices = {
    createNotification: async (data:TCreateNotificationInput) => {
        const{notificationType, topic ,message , from , to} = data;
        const notification = await Notification.create({...data});
        
        return notification;
    }
}