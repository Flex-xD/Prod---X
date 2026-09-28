import mongoose, { Model } from "mongoose";

export interface IDailyActivity extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    date: string; 
    tasksCreated: number;
    tasksCompleted: number;
    individualFocusSeconds: number;
    groupFocusSeconds: number;
    timersCreated: number;
    isProductiveDay: boolean;
}

const dailyActivitySchema = new mongoose.Schema<IDailyActivity>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    tasksCreated: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    individualFocusSeconds: { type: Number, default: 0 },
    groupFocusSeconds: { type: Number, default: 0 },
    timersCreated: { type: Number, default: 0 },
    isProductiveDay: { type: Boolean, default: false },
}, { timestamps: true });

dailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyActivity: Model<IDailyActivity> = mongoose.model<IDailyActivity>("DailyActivity", dailyActivitySchema);
export default DailyActivity;