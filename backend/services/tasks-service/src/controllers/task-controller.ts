
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import taskService from "../services/task-service";
import { CreateTaskInput, taskSchemaType } from "../schema/task-schema";
import { ApiError, asyncHandler, emitEvent, getUser, IAuthRequest, sendResponse, toObjectId } from "../shared";


export const createTask = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const { title, description }: CreateTaskInput = req.body;

    if (!title || !description) {
        throw ApiError(StatusCodes.BAD_REQUEST , "Title and Description are required !");
    }

    const task = await taskService.createTask(userId, { title, description });

    await emitEvent("task.created", {
        userId ,
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

// * Each microservice should have it's kafka instance with the same brokers across all along , with independent producers and consumers
// Fix this
