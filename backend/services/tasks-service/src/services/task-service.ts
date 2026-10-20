import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import Task from "../models/Task";
import User from "../shared/models/User";
import { CreateTaskInput } from "../schema/task-schema";
import { ApiError, emitEvent, getUser } from "../shared";

type TaskStatus = "pending" | "done";

const transitionTask = async (
    userId: Types.ObjectId,
    taskId: Types.ObjectId,
    from: TaskStatus,
    to: TaskStatus
) => {
    const updated = await Task.findOneAndUpdate(
        { _id: taskId, author: userId, status: from },
        { $set: { status: to } },
        { new: true }
    );
    if (updated) return updated;

    const existing = await Task.findOne({ _id: taskId, author: userId }).select("status");
    if (!existing) throw ApiError(StatusCodes.NOT_FOUND, "Task not found !");
    throw ApiError(StatusCodes.CONFLICT, `Task's status is already ${to}.`);
};

const taskService = {
    createTask: async (userId: Types.ObjectId, data: CreateTaskInput) => {
        const user = await getUser(userId);
        if (!user) throw ApiError(StatusCodes.NOT_FOUND, "User not found !");

        const task = await Task.create({ ...data, author: userId });
        await User.findByIdAndUpdate(userId, { $push: { userTasks: task._id } });
        return task;
    },

    getTodaysTasks: async (userId: Types.ObjectId) => {
        const user = await getUser(userId);
        if (!user) throw ApiError(StatusCodes.NOT_FOUND, "User not found !");

        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const filter = { author: user._id, createdAt: { $gte: start, $lte: end } };

        const [tasks, totalTasks] = await Promise.all([
            Task.find(filter)
                .sort({ createdAt: -1 })
                .populate({ path: "authorDetails", select: "_id username avatar" }),
            Task.countDocuments(filter),
        ]);

        const responseData = {
            tasks,
            metaData: { date: new Date().toISOString().slice(0, 10), totalTasks },
        };

        await emitEvent("task.today.get", responseData.metaData);
        return responseData;
    },

    // * All-time counts used by the dashboard's "all-time" stat card.
    getAllTimeTaskStats: async (userId: Types.ObjectId) => {
        const [total, done, pending] = await Promise.all([
            Task.countDocuments({ author: userId }),
            Task.countDocuments({ author: userId, status: "done" }),
            Task.countDocuments({ author: userId, status: "pending" }),
        ]);
        return { total, done, pending };
    },

    markTaskDone: async (userId: Types.ObjectId, taskId: Types.ObjectId) => {
        const task = await transitionTask(userId, taskId, "pending", "done");
        await emitEvent("task.completed", { userId: userId.toString(), taskId: task._id.toString() });
        return task;
    },

    markTaskPending: async (userId: Types.ObjectId, taskId: Types.ObjectId) => {
        const task = await transitionTask(userId, taskId, "done", "pending");
        await emitEvent("task.incompleted", { userId: userId.toString(), taskId: task._id.toString() });
        return task;
    },
};

export default taskService;