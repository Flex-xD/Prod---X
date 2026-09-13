export type NotificationType = "group-timer-request" | "daily-quote" | "productivity-hack";
export type InvitationStatus = "pending" | "accepted" | "declined";

export interface INotificationFrom {
    _id: string;
    username: string;
    avatar?: string;
}

export interface INotificationInvitation {
    groupTimerId: string;
    timerName: string;
}

export interface INotification {
    _id: string;
    notificationType: NotificationType;
    topic: string;
    message: string;
    from: INotificationFrom;
    readBy: string[];
    invitation?: INotificationInvitation;
    invitationResponses: { userId: string; status: InvitationStatus }[];
    createdAt: string;
    updatedAt: string;
}

export interface IGetNotificationsData {
    notifications: INotification[];
    hasMore: boolean;
    unreadCount: number;
}