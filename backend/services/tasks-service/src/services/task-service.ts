import mongoose, { Types } from "mongoose";
import Task from "../models/Task";
import { CreateTaskInput } from "../schema/task-schema";

const taskService = {
    createTask : async (userId:Types.ObjectId , data:CreateTaskInput) => {
        const task = await Task.create({
            ...data , 
            author:new mongoose.Types.ObjectId(userId)
        })

        await task.populate("author" , "_id username avatar");
        return task;
    }
}

export default taskService;