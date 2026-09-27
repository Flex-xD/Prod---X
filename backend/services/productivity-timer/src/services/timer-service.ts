import mongoose, { Types } from "mongoose";
import { TcreateProductivityTimerInputForBody } from "../schemas/timer-schema";
import { ApiError, emitEvent, getUser, logger } from "../shared";
import { StatusCodes } from "http-status-codes";
import Timer from "../models/Timer";
import { TgetProductivityTimeRequestBody } from "../controllers/timer-controller";
import User from "../shared/models/User";

const MAX_INDIVIDUAL_TIMERS = 5;

export const productivityTimerServices = {
    createProductivityTimer: async (userId: Types.ObjectId, data: TcreateProductivityTimerInputForBody) => {
        const now = new Date();
        const activeCount = await Timer.countDocuments({ author: userId, status: "pending", deadline: { $gte: now } });
        if (activeCount >= MAX_INDIVIDUAL_TIMERS) {
            throw ApiError(StatusCodes.BAD_REQUEST, "You already have the maximum number of active productivity timers !");
        }

        const { title, description, deadline, specifiedTime } = data;
        logger.info("Creating productivity timer for user ⏱️");

        const productivityTimer = new Timer({
            title, description: description ?? "", specifiedTime, deadline,
            author: userId, isActive: true, completedTime: 0,
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

        const goalSeconds = (productivityTimer.specifiedTime as number) * 60;
        productivityTimer.completedTime = Math.min((productivityTimer.completedTime ?? 0) + productivityDuration, goalSeconds);

        if (productivityTimer.completedTime >= goalSeconds) {
            productivityTimer.status = "done";
            productivityTimer.isActive = false;
            await emitEvent("productive.timer.completed", { userId, productivityTimerId, productivityTimer });
        }

        await Promise.all([productivityTimer.save(), user.save()]);
        return productivityTimer;
    },

    getActiveUsersProductivityTimer: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return Timer.find({ author: userId, status: "pending", deadline: { $gte: now } })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar isOnline");
    },

    getExpiredUsersProductivityTimer: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return Timer.find({ author: userId, status: "pending", deadline: { $lt: now } })
            .sort({ deadline: -1 })
            .populate("author", "username avatar isOnline");
    },

    getCompletedUsersProductivityTimer: async (userId: mongoose.Types.ObjectId) => {
        return Timer.find({ author: userId, status: "done" })
            .sort({ updatedAt: -1 })
            .populate("author", "username avatar isOnline");
    },
};