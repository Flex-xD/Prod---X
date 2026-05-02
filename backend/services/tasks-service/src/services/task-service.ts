import mongoose, { Types } from "mongoose";
import Task from "../models/Task";
import { CreateTaskInput } from "../schema/task-schema";
import { ApiError, emitEvent, getUser, toObjectId } from "../shared";
import { StatusCodes } from "http-status-codes";
import User from "../shared/models/User";

// * Implement Redis for caching tasks

const taskService = {
    createTask: async (userId: Types.ObjectId, data: CreateTaskInput) => {
        const task = await Task.create({
            ...data,
            author: new mongoose.Types.ObjectId(userId)
        })
        const user = await getUser(userId);
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }

        const updatedUser = User.findByIdAndUpdate(userId, {
            $push: { userTasks: task._id }
        });

        const populated = Task.populate("authorDetails", "_id username avatar");

        await Promise.all([
            updatedUser,
            populated
        ]);

        return task;
    },

    getTodaysTasks: async (userId: Types.ObjectId) => {
        const user = await getUser(userId);

        const start = new Date();
        start.setDate(start.getDate())
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const filter = {
            author: user._id,
            createdAt: {
                $gte: start,
                $lte: end
            }
        }

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .populate({
                path: "authorDetails",
                select: "_id username avatar"
            })

        const totalTasks = await Task.countDocuments(filter);
        const responseData = {
            tasks,
            metaData: {
                date: new Date().toISOString().slice(0, 10),
                totalTasks
            }
        }

        await emitEvent("task.today.get", responseData.metaData);
        return responseData;
    },

    markTaskDone: async (taskId: Types.ObjectId) => {
        const taskToBeMarkDone = await Task.findById(taskId);

        if (!taskToBeMarkDone) {
            throw ApiError(StatusCodes.NOT_FOUND, "Task to be mark done , not found !");
        }

        if (taskToBeMarkDone.status == 'done') {
            throw ApiError(StatusCodes.NOT_FOUND, "Task's status is already done.");
        }

        await Task.findByIdAndUpdate(taskId, {
            $set: {
                status: 'done'
            }
        })

        await emitEvent("task.status.updated", {
            taskId
        });

        return taskToBeMarkDone;
    },

    markTaskPending: async (taskId: Types.ObjectId) => {
        const taskToBeMarkPending = await Task.findById(taskId);

        if (!taskToBeMarkPending) {
            throw ApiError(StatusCodes.NOT_FOUND, "Task to be mark pending , not found !");
        }

        if (taskToBeMarkPending.status == 'pending') {
            throw ApiError(StatusCodes.NOT_FOUND, "Task's status is already pending.");
        }

        await Task.findByIdAndUpdate(taskId, {
            $set: {
                status: 'pending'
            }
        })

        await emitEvent("task.status.updated", {
            taskId
        });

        return taskToBeMarkPending;
    }

}

export default taskService;