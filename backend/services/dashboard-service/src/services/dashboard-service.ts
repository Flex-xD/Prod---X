import mongoose from "mongoose";
import DailyActivity from "../models/DailyActivity";
import UserStreak from "../models/UserStreak";
import GroupTimerSnapshot from "../models/GroupTimerSnapshot";
import { toDateKey, daysBetween, lastNDateKeys } from "../utils/date";
import { aiService } from "./ai-services";

type DayIncrement = Partial<
    Record<"tasksCreated" | "tasksCompleted" | "individualFocusSeconds" | "groupFocusSeconds" | "timersCreated", number>
>;

type Intensity = "high" | "medium" | "low" | "none";

const intensityFor = (focusSeconds: number, tasks: number): Intensity => {
    const hours = focusSeconds / 3600;
    if (hours >= 3) return "high";
    if (hours >= 1) return "medium";
    if (hours > 0 || tasks > 0) return "low";
    return "none";
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

const recordActivity = async (userId: mongoose.Types.ObjectId, increment: DayIncrement) => {
    await DailyActivity.findOneAndUpdate(
        { userId, date: toDateKey() },
        { $inc: increment as Record<string, number>, $set: { isProductiveDay: true } },
        { upsert: true }
    );
    await bumpStreak(userId);
    await aiService.invalidateTodaysActivityMessage(userId);
};

export const dashboardService = {
    recordTaskCreated: (userId: mongoose.Types.ObjectId) => recordActivity(userId, { tasksCreated: 1 }),

    recordTaskCompleted: (userId: mongoose.Types.ObjectId) => recordActivity(userId, { tasksCompleted: 1 }),

    recordTaskIncompleted: async (userId: mongoose.Types.ObjectId) => {
        await DailyActivity.findOneAndUpdate(
            { userId, date: toDateKey(), tasksCompleted: { $gt: 0 } },
            { $inc: { tasksCompleted: -1 } }
        );
        await aiService.invalidateTodaysActivityMessage(userId);
    },

    recordTimerCreated: (userId: mongoose.Types.ObjectId) => recordActivity(userId, { timersCreated: 1 }),

    recordIndividualFocusTime: (userId: mongoose.Types.ObjectId, seconds: number) =>
        recordActivity(userId, { individualFocusSeconds: seconds }),

    recordGroupFocusTime: (userId: mongoose.Types.ObjectId, seconds: number) =>
        recordActivity(userId, { groupFocusSeconds: seconds }),

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
            DailyActivity.find({ userId, date: { $gte: weekKeys[0], $lte: weekKeys[weekKeys.length - 1] } }),
            UserStreak.findOne({ userId }),
            GroupTimerSnapshot.findOne({ userId, deadline: { $gte: new Date() } }).sort({ updatedAt: -1 }),
        ]);

        const weeklyFocusSeconds = weekDocs.reduce(
            (sum, d) => sum + d.individualFocusSeconds + d.groupFocusSeconds,
            0
        );

        let groupTimer = null;
        if (latestGroupTimer) {
            const goalSeconds = latestGroupTimer.specifiedTime * 60;
            groupTimer = {
                groupTimerId: latestGroupTimer.groupTimerId,
                title: latestGroupTimer.title,
                deadline: latestGroupTimer.deadline,
                specifiedTime: latestGroupTimer.specifiedTime,
                myProductivityDone: latestGroupTimer.myProductivityDone,
                participantCount: latestGroupTimer.participantCount,
                progressPct:
                    goalSeconds > 0
                        ? Math.min(100, Math.round((latestGroupTimer.myProductivityDone / goalSeconds) * 100))
                        : 0,
            };
        }

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
            latestGroupTimer: groupTimer,
        };
    },

    getWeeklyGraph: async (userId: mongoose.Types.ObjectId) => {
        const weekKeys = lastNDateKeys(7);
        const docs = await DailyActivity.find({
            userId,
            date: { $gte: weekKeys[0], $lte: weekKeys[weekKeys.length - 1] },
        });
        const byDate = new Map(docs.map((d) => [d.date, d]));

        const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = toDateKey();

        return weekKeys.map((dateKey) => {
            const doc = byDate.get(dateKey);
            const dayIndex = new Date(`${dateKey}T00:00:00.000Z`).getUTCDay();
            return {
                day: dateKey === today ? "Today" : DAY_LABELS[dayIndex],
                date: dateKey,
                tasks: doc?.tasksCompleted ?? 0,
                focusSeconds: (doc?.individualFocusSeconds ?? 0) + (doc?.groupFocusSeconds ?? 0),
            };
        });
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

    getCalendar: async (userId: mongoose.Types.ObjectId, requestedYear: number) => {
        const currentYear = new Date().getUTCFullYear();
        const year = Number.isInteger(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100
            ? requestedYear
            : currentYear;

        const start = new Date(Date.UTC(year, 0, 1));
        const end = new Date(Date.UTC(year, 11, 31));
        const dateKeys: string[] = [];
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
            dateKeys.push(toDateKey(new Date(d)));
        }

        const docs = await DailyActivity.find({
            userId,
            date: { $gte: dateKeys[0], $lte: dateKeys[dateKeys.length - 1] },
        });
        const byDate = new Map(docs.map((d) => [d.date, d]));

        const cells = dateKeys.map((dateKey) => {
            const doc = byDate.get(dateKey);
            const focusSeconds = (doc?.individualFocusSeconds ?? 0) + (doc?.groupFocusSeconds ?? 0);
            const tasks = doc?.tasksCompleted ?? 0;
            return {
                date: dateKey,
                intensity: intensityFor(focusSeconds, tasks),
                hours: Math.round((focusSeconds / 3600) * 100) / 100,
                focusSeconds,
                tasks,
            };
        });

        const weekChunks: (typeof cells)[] = [];
        for (let i = 0; i < cells.length; i += 7) weekChunks.push(cells.slice(i, i + 7));
        return weekChunks;
    },

    getAvailableYears: async (userId: mongoose.Types.ObjectId) => {
        const earliest = await DailyActivity.findOne({ userId }).sort({ date: 1 });
        const startYear = earliest ? Number(earliest.date.slice(0, 4)) : new Date().getUTCFullYear();
        const currentYear = new Date().getUTCFullYear();
        const years: number[] = [];
        for (let y = startYear; y <= currentYear; y++) years.push(y);
        return years;
    },
};