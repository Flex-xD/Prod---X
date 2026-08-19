import mongoose, { Model, Schema } from "mongoose";


export interface IGroupTimer extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    title: string,
    description: string,
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
    isActive:boolean
}

const groupTimerSchema = new mongoose.Schema<IGroupTimer>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    specifiedTime: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "done"] as const,
        default: "pending",
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    invitedUsersId: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    participants: [{
        type: mongoose.Types.ObjectId
    }],
    participantsCompletedTime: [
        {
            participantId: mongoose.Types.ObjectId,
            completedTime: Number
        }
    ] , 
    isActive:{
        type:Boolean , 
        default:true, 
        isRequired:true 
    }
}, {
    timestamps: true,
});

const GroupTimer: Model<IGroupTimer> = mongoose.model<IGroupTimer>("GroupTimer", groupTimerSchema);
export default GroupTimer;