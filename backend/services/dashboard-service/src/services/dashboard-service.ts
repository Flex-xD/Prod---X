import mongoose from "mongoose";
import DailyActivity from "../models/DailyActivity";
import UserStreak from "../models/UserStreak";
import GroupTimerSnapshot from "../models/GroupTimerSnapshot";
import { toDateKey, daysBetween, lastNDateKeys } from "../utils/date";
import { aiService } from "./ai-services";

const getOrInitDay = async (userId: mongoose.Types.ObjectId, date: string) => {
    return DailyActivity.findOneAndUpdate(
        { userId, date },
        { $setOnInsert: { userId, date } },
        { upsert: true, new: true }
    );
};

const bumpStreak = async (userId: mongoose.Types.ObjectId) => {
    const today = toDateKey();
    const streak = await UserStreak.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, currentStreak: 0, longestStreak: 0, lastActiveDate: "" } },
        { upsert: true, new: true }
    );

    if (streak.lastActiveDate === today) return; 

    const gap = streak.lastActiveDate ? daysBetween(streak.lastActiveDate, today) : null;
    const nextStreak = gap === 1 ? streak.currentStreak + 1 : 1;

    streak.currentStreak = nextStreak;
    streak.longestStreak = Math.max(streak.longestStreak, nextStreak);
    streak.lastActiveDate = today;
    await streak.save();
};

export const dashboardService = {
    recordTaskCreated: async (userId: mongoose.Types.ObjectId) => {
        const day = await getOrInitDay(userId, toDateKey());
        day.tasksCreated += 1;
        day.isProductiveDay = true;
        await day.save();
        await bumpStreak(userId);
        await aiService.invalidateTodaysActivityMessage(userId);
    },

    recordTaskCompleted: async (userId: mongoose.Types.ObjectId) => {
        const day = await getOrInitDay(userId, toDateKey());
        day.tasksCompleted += 1;
        day.isProductiveDay = true;
        await day.save();
        await bumpStreak(userId);
        await aiService.invalidateTodaysActivityMessage(userId);
    },

    recordTimerCreated: async (userId: mongoose.Types.ObjectId) => {
        const day = await getOrInitDay(userId, toDateKey());
        day.timersCreated += 1;
        day.isProductiveDay = true;
        await day.save();
        await bumpStreak(userId);
        await aiService.invalidateTodaysActivityMessage(userId);
    },

    recordIndividualFocusTime: async (userId: mongoose.Types.ObjectId, seconds: number) => {
        const day = await getOrInitDay(userId, toDateKey());
        day.individualFocusSeconds += seconds;
        day.isProductiveDay = true;
        await day.save();
        await bumpStreak(userId);
        await aiService.invalidateTodaysActivityMessage(userId);
    },

    recordGroupFocusTime: async (userId: mongoose.Types.ObjectId, seconds: number) => {
        const day = await getOrInitDay(userId, toDateKey());
        day.groupFocusSeconds += seconds;
        day.isProductiveDay = true;
        await day.save();
        await bumpStreak(userId);
        await aiService.invalidateTodaysActivityMessage(userId);
    },

    upsertGroupTimerSnapshot: async (
        userId: mongoose.Types.ObjectId,
        data: {
            groupTimerId: mongoose.Types.ObjectId;
            title: string;
            deadline: Date;
            specifiedTime: number;
            myProductivityDone: number;
            participantCount: number;
            isActive: boolean;
        }
    ) => {
        await GroupTimerSnapshot.findOneAndUpdate(
            { userId, groupTimerId: data.groupTimerId },
            { $set: data },
            { upsert: true }
        );
    },

    getSummary: async (userId: mongoose.Types.ObjectId) => {
        const today = toDateKey();
        const weekKeys = lastNDateKeys(7);

        const [todayDoc, weekDocs, streak, latestGroupTimer] = await Promise.all([
            DailyActivity.findOne({ userId, date: today }),
            DailyActivity.find({ userId, date: { $in: weekKeys } }),
            UserStreak.findOne({ userId }),
            GroupTimerSnapshot.findOne({ userId, deadline: { $gte: new Date() } }).sort({ updatedAt: -1 }),
        ]);

        const weeklyFocusSeconds = weekDocs.reduce(
            (sum, d) => sum + d.individualFocusSeconds + d.groupFocusSeconds, 0
        );

        return {
            tasksToday: {
                created: todayDoc?.tasksCreated ?? 0,
                completed: todayDoc?.tasksCompleted ?? 0,
            },
            streak: {
                current: streak?.currentStreak ?? 0,
                longest: streak?.longestStreak ?? 0,
            },
            weeklyFocusSeconds,
            latestGroupTimer: latestGroupTimer
                ? {
                    groupTimerId: latestGroupTimer.groupTimerId,
                    title: latestGroupTimer.title,
                    deadline: latestGroupTimer.deadline,
                    specifiedTime: latestGroupTimer.specifiedTime,
                    myProductivityDone: latestGroupTimer.myProductivityDone,
                    participantCount: latestGroupTimer.participantCount,
                    progressPct: Math.min(
                        100,
                        Math.round((latestGroupTimer.myProductivityDone / (latestGroupTimer.specifiedTime * 60)) * 100)
                    ),
                }
                : null,
        };
    },

    getWeeklyGraph: async (userId: mongoose.Types.ObjectId) => {
        const weekKeys = lastNDateKeys(7);
        const docs = await DailyActivity.find({ userId, date: { $in: weekKeys } });
        const byDate = new Map(docs.map((d) => [d.date, d]));

        const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = toDateKey();

        return weekKeys.map((dateKey) => {
            const doc = byDate.get(dateKey);
            const dayOfWeek = new Date(dateKey + "T00:00:00Z").getUTCDay();
            const focusSeconds = (doc?.individualFocusSeconds ?? 0) + (doc?.groupFocusSeconds ?? 0);
            return {
                day: dateKey === today ? "Today" : DAY_LABELS[dayOfWeek],
                date: dateKey,
                tasks: doc?.tasksCompleted ?? 0,
                hours: Math.round((focusSeconds / 3600) * 10) / 10,
            };
        });
    },

    getCalendar: async (userId: mongoose.Types.ObjectId, weeks: number = 53) => {
        const dateKeys = lastNDateKeys(weeks * 7);
        const docs = await DailyActivity.find({ userId, date: { $in: dateKeys } });
        const byDate = new Map(docs.map((d) => [d.date, d]));

        const cells = dateKeys.map((dateKey) => {
            const doc = byDate.get(dateKey);
            const focusSeconds = (doc?.individualFocusSeconds ?? 0) + (doc?.groupFocusSeconds ?? 0);
            const hours = focusSeconds / 3600;

            let intensity: "high" | "medium" | "low" | "none" = "none";
            if (hours >= 3) intensity = "high";
            else if (hours >= 1) intensity = "medium";
            else if (hours > 0 || (doc?.tasksCompleted ?? 0) > 0) intensity = "low";

            return { date: dateKey, intensity, hours: Math.round(hours * 10) / 10 };
        });

        const weekChunks: typeof cells[] = [];
        for (let i = 0; i < cells.length; i += 7) weekChunks.push(cells.slice(i, i + 7));
        return weekChunks;
    },

    getAiTip: async (userId: mongoose.Types.ObjectId) => aiService.getDailyTip(userId),

    getActivityMessage: async (userId: mongoose.Types.ObjectId) => {
        const today = toDateKey();
        const [todayDoc, streak] = await Promise.all([
            DailyActivity.findOne({ userId, date: today }),
            UserStreak.findOne({ userId }),
        ]);

        return aiService.getDailyActivityMessage(userId, {
            tasksCompletedToday: todayDoc?.tasksCompleted ?? 0,
            tasksCreatedToday: todayDoc?.tasksCreated ?? 0,
            focusSecondsToday: (todayDoc?.individualFocusSeconds ?? 0) + (todayDoc?.groupFocusSeconds ?? 0),
            currentStreak: streak?.currentStreak ?? 0,
        });
    },
};