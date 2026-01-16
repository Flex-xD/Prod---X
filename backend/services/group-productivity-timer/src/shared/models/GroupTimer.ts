import mongoose, { Model } from "mongoose";


export interface IGroupTimer extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    title: string,
    body: string,
    // ? see if setting the below timer to Date is good or find a way to set it to time 
    specifiedTime: Number,
    deadline: Date,
    isCompleted: boolean,
    author: mongoose.Types.ObjectId
    invitedUsersId:mongoose.Types.ObjectId[]
    participants: mongoose.Types.ObjectId[]
}

const groupTimerSchema = new mongoose.Schema<IGroupTimer>({
    title: {
        type: String,
        required: true,
    },
    body: {
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
    isCompleted: {
        type: Boolean,
        default: false,
    },
    author: {
        userId:{
            type:mongoose.Types.ObjectId 
        } , 
        username:{
            type:String ,
        }
        // ? I can late on add avatar 
    },
    invitedUsersId:[{
        type:mongoose.Schema.Types.ObjectId
    }] ,
    participants: [{
        type: mongoose.Types.ObjectId
    }],
}, {
    timestamps: true,
})

const GroupTimer: Model<IGroupTimer> = mongoose.model<IGroupTimer>("GroupTimer", groupTimerSchema);
export default GroupTimer;