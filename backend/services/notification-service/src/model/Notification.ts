import mongoose, { Model } from "mongoose";

export interface INotification extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    notificationType: "group-timer-request" | "daily-quote" | "productivity-hack",
    topic: string,
    message: string,
    from: mongoose.Types.ObjectId,
    to: mongoose.Types.ObjectId[],
    invitation?: {
        groupTimerId: mongoose.Types.ObjectId,
        timerName: string,
    },
    readBy: mongoose.Types.ObjectId[],
    invitationResponses: {
        userId: mongoose.Types.ObjectId,
        status: "pending" | "accepted" | "declined"
    }[],
    createdAt: Date,
    updatedAt: Date,
}

const notificationSchema = new mongoose.Schema<INotification>({
    notificationType: {
        type: String,
        enum: ["group-timer-request", "daily-quote", "productivity-hack"],
        required: true
    },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    from: { type: mongoose.Types.ObjectId, ref: "User" },
    to: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    invitation: {
        groupTimerId: { type: mongoose.Types.ObjectId, ref: "GroupTimer" },
        timerName: { type: String },
    },
    readBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    invitationResponses: [{
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }
    }],
}, { timestamps: true });

notificationSchema.index({ to: 1, createdAt: -1 });

const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;