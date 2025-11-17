import mongoose, { Model } from "mongoose";
import { refreshTokenType } from "../schemas/refresh-token-schema";
export interface userDocument extends refreshTokenType, mongoose.Document { }


const refreshTokenSchema = new mongoose.Schema<userDocument>({
    hashedToken: { type: String, required: true },
    userAgent: String,
    ip: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date , 
    absoluteExpiresAt:Date
}, { _id: true });

const Token :Model<userDocument>= mongoose.model<userDocument>("Token", refreshTokenSchema);
export default Token;