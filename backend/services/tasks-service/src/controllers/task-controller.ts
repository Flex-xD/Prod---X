import { IAuthRequest } from "@shared/src/middlewares/auth-middleware";
import { asyncHandler } from "@shared/src/utils/async-handler";
import { sendResponse } from "@shared/src/utils/response-utils";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import taskService from "../services/task-service";
import { CreateTaskInput, taskSchemaType } from "../schema/task-schema";
import { ApiError } from "@shared/src/utils/api-error";
import { getUserOrThrow } from "@shared/src/utils/user-exits";
import { toObjectId } from "@shared/src/utils/into-objectId";


export const createTask = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { userId } = req;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const { title, description }: CreateTaskInput = req.body;

    // ! User the zod middleware to validate the request body (before testing it)

    await getUserOrThrow(toObjectId(userId));
    const task = await taskService.createTask(toObjectId(userId), { title, description });

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Task created successfully !",
        data: task
    })
})

