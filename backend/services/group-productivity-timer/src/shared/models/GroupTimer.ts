import mongoose, { Model, Schema } from "mongoose";

export interface IGroupParticipant {
    user: mongoose.Types.ObjectId;
    productivityDone: number;
    isCurrentlyActive: boolean;
    rank: number;
}

export interface IGroupTimer extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    specifiedTime: number;
    deadline: Date;
    status: "pending" | "done";
    author: mongoose.Types.ObjectId;
    invitedUsersId: mongoose.Types.ObjectId[];
    participants: IGroupParticipant[];
    isActive: boolean;
}

export const groupParticipantSchema = new mongoose.Schema<IGroupParticipant>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productivityDone: { type: Number, default: 0 },
    isCurrentlyActive: { type: Boolean, default: false },
    rank: { type: Number, default: 0 },
}, { _id: false });

const groupTimerSchema = new mongoose.Schema<IGroupTimer>({
    title: { type: String, required: true },
    description: { type: String, required: false },
    specifiedTime: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["pending", "done"] as const, default: "pending" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    invitedUsersId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    participants: [groupParticipantSchema],
    isActive: { type: Boolean, default: true, required: true },
}, { timestamps: true });

const GroupTimer: Model<IGroupTimer> = mongoose.model<IGroupTimer>("GroupTimer", groupTimerSchema);
export default GroupTimer;