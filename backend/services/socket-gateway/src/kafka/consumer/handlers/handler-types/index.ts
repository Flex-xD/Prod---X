import mongoose from "mongoose";

export interface IGroupTimer extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    title: string,
    body: string,
    // ? see if setting the below timer to Date is good or find a way to set it to time 
    specifiedTime: number,
    deadline: Date,
    status: "pending" | "done";
    author: mongoose.Types.ObjectId
    invitedUsersId: mongoose.Types.ObjectId[]
    participants: mongoose.Types.ObjectId[]
    participantsCompletedTime:
    {
        userId: mongoose.Types.ObjectId,
        completedTime: number
    }[];
}

export type TEventInvitationNotificationCreated = {
    username: string,
    notifcation:INotification
}

export interface INotification extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    notificationType: "group-timer-request" | "daily-quote" | "productivity-hack"
    topic: string,
    message: string,
    from: mongoose.Types.ObjectId,
    to: mongoose.Types.ObjectId[],
    invitation: {
        timerName: string,
    }
}

