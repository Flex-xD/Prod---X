import mongoose from "mongoose";
import FocusSessionLock from "../models/FocusSessionLock";
import { ApiError } from "../shared";
import { StatusCodes } from "http-status-codes";

export const focusLockService = {
    acquire: async (userId: mongoose.Types.ObjectId, sessionType: "individual-timer" | "group-timer" | "pomodoro", refId: string) => {
        const existing = await FocusSessionLock.findOne({ userId });
        if (existing && existing.refId !== refId) {
            throw ApiError(
                StatusCodes.CONFLICT,
                `You already have an active session running (${existing.sessionType}). Pause or submit it before starting another.`
            );
        }
        return FocusSessionLock.findOneAndUpdate(
            { userId },
            { userId, sessionType, refId, startedAt: new Date(), accumulatedSeconds: existing?.refId === refId ? existing.accumulatedSeconds : 0, isRunning: true },
            { upsert: true, new: true }
        );
    },

    pause: async (userId: mongoose.Types.ObjectId, refId: string, elapsedSinceStart: number) => {
        const lock = await FocusSessionLock.findOne({ userId, refId });
        if (!lock) return null;
        lock.accumulatedSeconds += elapsedSinceStart;
        lock.isRunning = false;
        await lock.save();
        return lock;
    },

    release: async (userId: mongoose.Types.ObjectId, refId: string) => {
        await FocusSessionLock.deleteOne({ userId, refId });
    },

    get: async (userId: mongoose.Types.ObjectId) => FocusSessionLock.findOne({ userId }),
};