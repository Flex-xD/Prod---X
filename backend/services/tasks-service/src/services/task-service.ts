import mongoose, { Types } from "mongoose";
import Task from "../models/Task";
import { CreateTaskInput } from "../schema/task-schema";
import { ApiError, getUser } from "../shared";
import { StatusCodes } from "http-status-codes";

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
        user.userTasks.push(task._id);
        await Promise.all([
            user.save(),
            // ? See here if authorDetails is correct or not
            task.populate("authorDetials", "_id username avatar")
        ])

        return task;
    },
    getTask: async (taskId: Types.ObjectId) => {
        // * I am populating the task when I am creating it , so check whether you have to do it again or not when getting task
        const task = await Task.findById(taskId)
        return task;
    },
}

export default taskService;