import mongoose, { Model } from "mongoose";

export interface INotification extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    notificationType:"group-timer-request" | "daily-quote" | "productivity-hack"
    topic: string,
    message: string,
    // I have removed the optional for now on from both the field below
    from: mongoose.Types.ObjectId,
    to: mongoose.Types.ObjectId[] , 
    invitation : {
        timerName:string, 
    }
}

// ? I can add some fields related to the group-productivity-timer

const notificationSchema = new mongoose.Schema<INotification>({
    notificationType:{
        type:String , 
        enum :["group-timer-request" , "daily-quote" , "productivity-hack"] , 
        required:true
    },
    topic: {
        type: String,
        requiredcd : true
    },
    message: {
        type: String,
        required: true,
    },
    from: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    to:[ {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
})

const Notification : Model<INotification> = mongoose.model<INotification>("Notification" , notificationSchema);
export default Notification;