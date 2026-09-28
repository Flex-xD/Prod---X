import mongoose, { Model } from "mongoose";

export interface IUserStreak extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
}

const userStreakSchema = new mongoose.Schema<IUserStreak>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
}, { timestamps: true });

const UserStreak: Model<IUserStreak> = mongoose.model<IUserStreak>("UserStreak", userStreakSchema);
export default UserStreak;