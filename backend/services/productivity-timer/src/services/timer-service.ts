import mongoose, { Types } from "mongoose";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { ApiError, emitEvent, getUser, logger, sendResponse } from "../shared";
import { StatusCodes } from "http-status-codes";
import Timer from "../models/Timer";
import { TgetProductivityTimeRequestBody } from "../controllers/timer-controller";
import User from "../shared/models/User";
import { int } from "zod";

// * Implement Redis caching later on

export const productivityTimerServices = {
    createProductivityTimer: async (userId: Types.ObjectId, data: TcreateProductivityTimerInputForBody) => {

        const { title, body, deadline, specifiedTime } = data;

        logger.info("Creating productivity timer for user ⏱️")

        // ? I can try to convert these fetched variables strings into their specified types like number or dates , I have to see first

        const productivityTimer = new Timer({
            title,
            body: body ? body : "",
            specifiedTime,
            deadline,
            author: userId,
            isCompleted: false,
            completedTime: 0
        });

        await Promise.all([
            productivityTimer.save(),
            User.findByIdAndUpdate(userId, {
                $push: {
                    userProductivityTimer: productivityTimer._id
                }
            })
        ])

        logger.info(`Productivity timer created with id: ${productivityTimer._id} for user ${userId}`);

        return productivityTimer;
    },

    submitProductivityTime: async (userId: Types.ObjectId, data: TgetProductivityTimeRequestBody) => {
        const user = await getUser(userId);
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND, "User not found !");
        }

        const { productivityDuration, productivityTimerId } = data;

        const productivityTimer = await Timer.findById(productivityTimerId);

        // * Check later on wether if I don't allowed the certain actions from the frontend , then is it still a good practice to keep check here

        if (!productivityTimer) {
            throw ApiError(StatusCodes.NOT_FOUND, "Productivity Timer not found !");
        }

        // ? I think I don't need to check this condition as user will not be able to edit the productivity-timer after it is either marked completed or has reached deadline

        if (productivityTimer.status == "done") {
            throw ApiError(StatusCodes.CONFLICT, "Productivity Timer is already completed !");
        }

        if (Date.now() > productivityTimer.deadline.getTime()) {
            throw ApiError(StatusCodes.CONFLICT, "Productivity Timer has hit the deadline !")
        }

        const remainingTimer = productivityTimer.specifiedTime as number - productivityTimer.completedTime!

        if (productivityDuration > remainingTimer) {
            // ? Changing the status here from 'pending' to 'done'
            productivityTimer.status = 'done';
            await emitEvent("productive.timer.completed", {
                userId,
                productivityTimerId,
                productivityTimer
            });
        }

        productivityTimer.completedTime! += productivityDuration;

        await Promise.all([
            productivityTimer.save(),
            user.save()
        ])

        // ? utilize this event on the other relevant service


        return productivityTimer;
    },

    getActiveUsersProductivityTimer: async (userId:mongoose.Types.ObjectId) => {
        const filter = {
            $and: [
                { isActive: true },
                { author: userId }
            ]
        };

        const activeProductivityTimers = await Timer.find(filter).sort({createdAt:-1});

        // ? Hard coded value is a bad practice
        if (activeProductivityTimers.length == 5) {
            throw ApiError(StatusCodes.BAD_REQUEST , "User already have maximum productivity-timers !");
        }

        // * If it is empty array , send the message in the controller 

        return { activeProductivityTimers };
    }
}