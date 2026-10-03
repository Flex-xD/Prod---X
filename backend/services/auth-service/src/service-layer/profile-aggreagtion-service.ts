import axios from "axios";
import { logger } from "../shared/utils/winston-logger";


const safeGet = async (url: string, userId: string) => {
    try {
        const response = await axios.get(url, {
            headers: { "x-user-id": userId },
            timeout: 5000,
        });
        return response.data?.data ?? null;
    } catch (error) {
        logger.error(`❌ Profile aggregation call failed: ${url}`, { error: (error as Error).message });
        return null;
    }
};

export const profileAggregationService = {
    getTaskStats: async (userId: string) => {
        const base = process.env.TASKS_SERVICE_URL;
        const todays = await safeGet(`${base}/api/v1/tasks/today`, userId);

        // ? tasks-service doesn't expose an "all tasks grouped by status" endpoint in what
        // we've seen so far — this degrades gracefully to today's counts only. If/when
        // tasks-service adds a lifetime-stats endpoint, swap this call for that one.
        const tasks = todays?.tasks ?? [];
        return {
            totalToday: tasks.length,
            pending: tasks.filter((t: any) => t.status === "pending").length,
            inProgress: tasks.filter((t: any) => t.status === "in-progress").length,
            done: tasks.filter((t: any) => t.status === "done").length,
        };
    },

    getIndividualTimerStats: async (userId: string) => {
        const base = process.env.PRODUCTIVITY_TIMER_SERVICE_URL;
        const [active, completed, expired] = await Promise.all([
            safeGet(`${base}/api/v1/productivity-timer/active-productivity-timers`, userId),
            safeGet(`${base}/api/v1/productivity-timer/completed-productivity-timers`, userId),
            safeGet(`${base}/api/v1/productivity-timer/expired-productivity-timers`, userId),
        ]);

        const activeList = active ?? [];
        const completedList = completed ?? [];
        const expiredList = expired ?? [];

        const totalFocusSeconds = [...activeList, ...completedList, ...expiredList].reduce(
            (sum: number, t: any) => sum + (t.completedTime ?? 0), 0
        );

        return {
            active: activeList.length,
            completed: completedList.length,
            expired: expiredList.length,
            totalFocusSeconds,
        };
    },

    getGroupTimerStats: async (userId: string) => {
        const base = process.env.GROUP_PRODUCTIVITY_TIMER_SERVICE_URL;
        const [active, completed, expired] = await Promise.all([
            safeGet(`${base}/api/v1/group-productivity-timer/active-group-timers`, userId),
            safeGet(`${base}/api/v1/group-productivity-timer/completed-group-timers`, userId),
            safeGet(`${base}/api/v1/group-productivity-timer/expired-group-timers`, userId),
        ]);

        const activeList = active ?? [];
        const completedList = completed ?? [];
        const expiredList = expired ?? [];

        const totalFocusSeconds = [...activeList, ...completedList, ...expiredList].reduce(
            (sum: number, t: any) => {
                const myParticipant = t.participants?.find((p: any) => p.user?._id === userId);
                return sum + (myParticipant?.productivityDone ?? 0);
            }, 0
        );

        return {
            active: activeList.length,
            completed: completedList.length,
            expired: expiredList.length,
            totalFocusSeconds,
        };
    },

    getStreakAndWeeklyFocus: async (userId: string) => {
        const base = process.env.DASHBOARD_SERVICE_URL;
        const summary = await safeGet(`${base}/api/v1/dashboard/summary`, userId);
        return {
            currentStreak: summary?.streak?.current ?? 0,
            longestStreak: summary?.streak?.longest ?? 0,
            weeklyFocusSeconds: summary?.weeklyFocusSeconds ?? 0,
        };
    },

    getFullProfileStats: async (userId: string) => {
        const [tasks, individualTimers, groupTimers, streakData] = await Promise.all([
            profileAggregationService.getTaskStats(userId),
            profileAggregationService.getIndividualTimerStats(userId),
            profileAggregationService.getGroupTimerStats(userId),
            profileAggregationService.getStreakAndWeeklyFocus(userId),
        ]);

        return { tasks, individualTimers, groupTimers, streakData };
    },
};