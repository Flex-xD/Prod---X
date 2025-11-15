import mongoose, { Model } from "mongoose";
import { userType } from "../schemas/user-schema";
export interface userDocument extends userType, mongoose.Document { }

const userSchema = new mongoose.Schema<userDocument>({
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
        required: function (this: userDocument): boolean {
            return this.provider === "local"
        },
    },
    avatar: {
        type: String,
        required: false
    },
    userTodos: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo"
        }]
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    }
})

const User: Model<userDocument> = mongoose.model<userDocument>("User", userSchema);
export default User;