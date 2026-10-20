import mongoose, { Model } from "mongoose";

export interface IToken extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    hashedToken: string;
    userAgent?: string;
    ip?: string;
    expiresAt: Date;
    absoluteExpiresAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<IToken>(
    {
        hashedToken: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userAgent: {
            type: String,
        },
        ip: {
            type: String,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        absoluteExpiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Token: Model<IToken> = mongoose.model<IToken>(
    "Token",
    refreshTokenSchema
);

export default Token;