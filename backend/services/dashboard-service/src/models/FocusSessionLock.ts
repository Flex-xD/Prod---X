import mongoose, { Model } from "mongoose";

export interface IFocusSessionLock extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    sessionType: "individual-timer" | "group-timer" | "pomodoro";
    refId: string;
    startedAt: Date;
    accumulatedSeconds: number;
    isRunning: boolean;
}

const focusSessionLockSchema = new mongoose.Schema<IFocusSessionLock>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    sessionType: { type: String, enum: ["individual-timer", "group-timer", "pomodoro"], required: true },
    refId: { type: String, required: true },
    startedAt: { type: Date, required: true },
    accumulatedSeconds: { type: Number, default: 0 },
    isRunning: { type: Boolean, default: true },
}, { timestamps: true });

const FocusSessionLock: Model<IFocusSessionLock> = mongoose.model<IFocusSessionLock>("FocusSessionLock", focusSessionLockSchema);
export default FocusSessionLock;