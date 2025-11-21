import mongoose, { Model } from "mongoose";
import { userType } from "../schemas/user-schema";
import bcrypt from "bcrypt";
import refreshTokenSchema from "../schemas/refresh-token-schema";
export interface userDocument extends Omit<userType, "_id">, mongoose.Document { }
// Define a interface for User document and make it a bit simple

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
    } ,
    refreshTokens:[{refreshTokenSchema}]
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

const User: Model<userDocument> = mongoose.model<userDocument>("User", userSchema);
export default User;