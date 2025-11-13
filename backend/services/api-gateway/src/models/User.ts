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
        required: true,
    },
    userTodos: {
        type: [{
            type: mongoose.Schema.Types.ObjectId , 
            ref:"Todo"
        }]
    }
})

const User : Model<userDocument> = mongoose.model<userDocument>("User" , userSchema);
export default User;