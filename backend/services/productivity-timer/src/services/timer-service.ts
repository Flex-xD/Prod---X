import mongoose, { Types } from "mongoose";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { ApiError, emitEvent, getUser, logger, sendResponse } from "../shared";
import { StatusCodes } from "http-status-codes";
import Timer from "../models/Timer";
import { TgetProductivityTimeRequestBody } from "../controllers/timer-controller";
import User from "../shared/models/User";
import { int } from "zod";

export const productivityTimerServices = {
    createProductivityTimer: async (userId: Types.ObjectId, data: TcreateProductivityTimerInputForBody) => {
        const activeCount = await Timer.countDocuments({ author: userId, status: "pending" });
        if (activeCount >= 5) {
            throw ApiError(StatusCodes.BAD_REQUEST, "You already have the maximum number of active productivity timers !");
        }

        const { title, description, deadline, specifiedTime } = data;
        const productivityTimer = new Timer({
            title,
            description: description ?? "",
            specifiedTime,
            deadline,
            author: userId,
            isActive: true,
            completedTime: 0,
        });

        await Promise.all([
            productivityTimer.save(),
            User.findByIdAndUpdate(userId, { $push: { userProductivityTimer: productivityTimer._id } }),
        ]);

        return productivityTimer;
    },

    submitProductivityTime: async (userId: Types.ObjectId, data: TgetProductivityTimeRequestBody) => {
        const user = await getUser(userId);
        const { productivityDuration, productivityTimerId } = data;

        const productivityTimer = await Timer.findById(productivityTimerId);
        if (!productivityTimer) throw ApiError(StatusCodes.NOT_FOUND, "Productivity Timer not found !");
        if (productivityTimer.status === "done") {
            throw ApiError(StatusCodes.CONFLICT, "Productivity Timer is already completed !");
        }
        if (Date.now() > productivityTimer.deadline.getTime()) {
            throw ApiError(StatusCodes.CONFLICT, "Productivity Timer has hit the deadline !");
        }

        const remainingTime = (productivityTimer.specifiedTime as number) * 60 - (productivityTimer.completedTime ?? 0);

        productivityTimer.completedTime = (productivityTimer.completedTime ?? 0) + productivityDuration;


        if (productivityDuration >= remainingTime) {
            productivityTimer.status = "done";
            productivityTimer.isActive = false;
            await emitEvent("productive.timer.completed", { userId, productivityTimerId, productivityTimer });
        }

        await Promise.all([productivityTimer.save(), user.save()]);
        return productivityTimer;
    },

    getActiveUsersProductivityTimer: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return Timer.find({ author: userId, deadline: { $gte: now } })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar isOnline");
    },

    getExpiredUsersProductivityTimer: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return Timer.find({ author: userId, deadline: { $lt: now } })
            .sort({ deadline: -1 })
            .populate("author", "username avatar isOnline");
    },
}