import mongoose from "mongoose";
import FocusSessionLock from "../models/FocusSessionLock";
import { ApiError } from "../shared";
import { StatusCodes } from "http-status-codes";

const STALE_LOCK_MS = 2 * 60 * 60 * 1000; // 2h — longer than any real pomodoro

export const focusLockService = {
    acquire: async (userId: mongoose.Types.ObjectId, sessionType: "individual-timer" | "group-timer" | "pomodoro", refId: string) => {
        const existing = await FocusSessionLock.findOne({ userId });

        if (existing && existing.refId !== refId) {
            const isStale = Date.now() - existing.startedAt.getTime() > STALE_LOCK_MS;
            // * Only a *running*, fresh session blocks a new one — a paused lock
            // * must not (the error message has always promised "pause or submit
            // * it before starting another"), and a leaked lock (closed tab while
            // * running) must never block the user forever.
            if (existing.isRunning && !isStale) {
                throw ApiError(
                    StatusCodes.CONFLICT,
                    `You already have an active session running (${existing.sessionType}). Pause or submit it before starting another.`
                );
            }
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