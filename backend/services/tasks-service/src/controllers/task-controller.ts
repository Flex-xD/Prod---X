
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import taskService from "../services/task-service";
import { CreateTaskInput, taskSchemaType } from "../schema/task-schema";
import { ApiError, asyncHandler, emitEvent, getUser, IAuthRequest, sendResponse, toObjectId } from "../shared";
import mongoose, { ObjectId } from "mongoose";
import Task from "../models/Task";


export const createTask = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const { title, description }: CreateTaskInput = req.body;

    if (!title || !description) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title and Description are required !");
    }

    console.log("TASK :", { title, description });
    const task = await taskService.createTask(toObjectId(userId), { title, description });

    await emitEvent("task.created", {
        userId,
        taskId: task._id,
        task
    })

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Task created successfully !",
        data: task
    })
})

// ? Below whenever I am getting tasks , I am getting a extra id field in the array
export const getTodaysTask = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { tasks, metaData } = await taskService.getTodaysTasks(toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        data: {
            tasks,
            metaData
        },
        success: true,
        message: "User tasks fetched successfully !"
    })

})

// Each microservice should have it's kafka instance with the same brokers across all along , with independent producers and consumers
// Fix this
