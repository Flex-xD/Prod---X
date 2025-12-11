import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
    _id:mongoose.Types.ObjectId ,
    username:string ,
    email:string , 
    password:string , 
    avatar:string ,
    userTasks:mongoose.Types.ObjectId[] ,  
    // ! Here add the s at the end of the below userProductivityTimer user's field
    userProductivityTimer:mongoose.Types.ObjectId[] ,
    provider:"local" | "google" ,
    refreshTokens:mongoose.Types.ObjectId[]
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
        type:[{
            type:mongoose.Schema.Types.ObjectId , 
            ref:"Timer"
        }]
    }, 
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    } ,
    refreshTokens:[{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"RefreshToken"
    }]
} , {
    timestamps:true
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;