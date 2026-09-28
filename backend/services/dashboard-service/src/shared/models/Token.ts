import mongoose, { Model } from "mongoose";

interface IToken extends mongoose.Document {
    _id:mongoose.Types.ObjectId ,
    hashedToken:string ,
    userAgent?:string ,
    ip:string ,
    expiresAt:Date , 
    absoluteExpiresAt:Date
}

const refreshTokenSchema = new mongoose.Schema<IToken>({
    hashedToken: { type: String, required: true },
    userAgent: String,
    ip: String,
    expiresAt: Date , 
    absoluteExpiresAt:Date
}, { _id: true });

const Token :Model<IToken>= mongoose.model<IToken>("Token", refreshTokenSchema);
export default Token;