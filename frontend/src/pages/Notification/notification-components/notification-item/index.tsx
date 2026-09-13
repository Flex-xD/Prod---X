import type { INotification } from "@/types/notification";
import InvitationNotificationItem from "../invitation-notification-item";
import GenericNotificationItem from "../generic-notification-item";

interface Props {
    notification: INotification;
    index: number;
}

const NotificationItem = ({ notification, index }: Props) => {
    if (notification.notificationType === "group-timer-request") {
        return <InvitationNotificationItem notification={notification} index={index} />;
    }
    return <GenericNotificationItem notification={notification} index={index} />;
};

export default NotificationItem;