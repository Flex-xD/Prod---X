import { Types } from "mongoose";
import { createProductivityTimerInputForBody } from "../schemas/timer-schema";
import { ApiError, getUser, logger } from "../shared";
import { StatusCodes } from "http-status-codes";
import Timer from "../models/Timer";

// * Implement Redis caching later on

export const productivityTimerServices = {
    createProductivityTimer: async (userId: Types.ObjectId, data: createProductivityTimerInputForBody) => {
        const user = await getUser(userId);

        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }

        const { title, body, deadline, specifiedTime } = data;
        if (!title || !specifiedTime || !deadline) {
            throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
        }

        logger.info("Creating productivity timer for user ⏱️")
        const productivityTimer = await Timer.create({
            title,
            body: body ? body : "",
            specifiedTime,
            deadline,
            author: userId,
            isCompleted: false,
            completedTime: 0
        })

        user.userProductivityTimer.push(productivityTimer._id);
        logger.info(`Productivity timer created with id: ${productivityTimer._id} for user ${userId}`);
        await user.save();

        return productivityTimer;        
    }
}