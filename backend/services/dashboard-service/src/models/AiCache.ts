import mongoose, { Model } from "mongoose";

export interface IAiCache extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    date: string;
    kind: "tip" | "activity";
    content: string;
    source: "ai" | "fallback";
}

const aiCacheSchema = new mongoose.Schema<IAiCache>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    kind: { type: String, enum: ["tip", "activity"], required: true },
    content: { type: String, required: true },
    source: { type: String, enum: ["ai", "fallback"], default: "fallback" },
}, { timestamps: true });

aiCacheSchema.index({ userId: 1, date: 1, kind: 1 }, { unique: true });

const AiCache: Model<IAiCache> = mongoose.model<IAiCache>("AiCache", aiCacheSchema);
export default AiCache;