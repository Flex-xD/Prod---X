import mongoose, { Model, Schema } from "mongoose";

export interface ITimer extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    title: string,
    description: string,
    // ? see if setting the below timer to Date is good or find a way to set it to time 
    specifiedTime: Number,
    isActive:boolean
    deadline: Date,
    completedTime: number | null,
    status: "pending" | "done";
    author: mongoose.Types.ObjectId
}

const timerSchema = new mongoose.Schema<ITimer>({
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
    isActive:{
        type:Boolean ,
        required:true , 
        default:true
    } ,
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
    completedTime: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true,
})

const Timer: Model<ITimer> = mongoose.model<ITimer>("Timer", timerSchema);
export default Timer;