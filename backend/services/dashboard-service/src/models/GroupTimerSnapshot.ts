import mongoose, { Model } from "mongoose";

export interface IGroupTimerSnapshot extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    groupTimerId: mongoose.Types.ObjectId;
    title: string;
    deadline: Date;
    specifiedTime: number; 
    myProductivityDone: number; 
    participantCount: number;
    isActive: boolean;
}

const groupTimerSnapshotSchema = new mongoose.Schema<IGroupTimerSnapshot>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    groupTimerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    specifiedTime: { type: Number, required: true },
    myProductivityDone: { type: Number, default: 0 },
    participantCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

groupTimerSnapshotSchema.index({ userId: 1, groupTimerId: 1 }, { unique: true });

const GroupTimerSnapshot: Model<IGroupTimerSnapshot> = mongoose.model<IGroupTimerSnapshot>("GroupTimerSnapshot", groupTimerSnapshotSchema);
export default GroupTimerSnapshot;