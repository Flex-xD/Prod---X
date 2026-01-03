import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
    _id:mongoose.Types.ObjectId ,
    username:string ,
    email:string , 
    password:string , 
    avatar:string ,
    userTasks:mongoose.Types.ObjectId[] , 
    userProductivityTimer:mongoose.Types.ObjectId[] ,
    userGroupProductivityTimer:mongoose.Types.ObjectId[] ,
    provider:"local" | "google" ,
    refreshTokens:mongoose.Types.ObjectId[]
    notifications:mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: function (this: IUser): boolean {
            return this.provider === "local"
        },
    },
    avatar: {
        type: String,
        required: false
    },
    userTasks: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo"
        }]
    }, 
    userProductivityTimer:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Timer"
        }]
    },
    userGroupProductivityTimer:{
        type:[{
            type:mongoose.Schema.Types.ObjectId , 
            ref:"GroupTimer",
        }]
    } ,
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    } ,
    refreshTokens:[{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"RefreshToken"
    }] , 
    notifications:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"Notification"
    }]
} , {
    timestamps:true
})

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;