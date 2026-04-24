import mongoose, { Schema, Model, Document, Types } from "mongoose";

interface ITask extends Document {
    _id:Types.ObjectId ;
    title: string;
    description?: string;
    author: Types.ObjectId;        
    status: "pending" | "in-progress" | "done";
    createdAt: Date;
    updatedAt: Date;
    // Virtual field (populated later)
    // ? should I even have this field below ?
    authorDetails?: {
        _id:Types.ObjectId ,
        username: string;
        avatar?: string;
    };
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "done"] as const,
            default: "pending",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

taskSchema.virtual("authorDetails", {
    ref: "User",
    localField: "author",
    foreignField: "_id",
    justOne: true,
});

taskSchema.index({ author: 1, createdAt: -1 });

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);
export default Task;