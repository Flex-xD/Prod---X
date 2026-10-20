import axios, { AxiosError } from "axios";
import { logger } from "../shared/utils/winston-logger";

interface Fetched<T> {
    data: T | null;
    failed: boolean;
}

interface Stat<T> {
    value: T;
    failed: boolean;
}

interface TimerBucket {
    active: number;
    completed: number;
    expired: number;
    totalFocusSeconds: number;
}

const serviceUrls = () => ({
    tasks: process.env.TASKS_SERVICE_URL || "http://localhost:4000",
    productivityTimer: process.env.PRODUCTIVITY_TIMER_SERVICE_URL || "http://localhost:6000",
    groupTimer: process.env.GROUP_PRODUCTIVITY_TIMER_SERVICE_URL || "http://localhost:9000",
    dashboard: process.env.DASHBOARD_SERVICE_URL || "http://localhost:7000",
});

const fetchData = async <T>(source: string, url: string, userId: string): Promise<Fetched<T>> => {
    try {
        const response = await axios.get(url, {
            headers: { "x-user-id": userId },
            timeout: 5000,
        });
        return { data: (response.data?.data ?? null) as T | null, failed: false };
    } catch (error) {
        const err = error as AxiosError;
        logger.error(
            `Profile aggregation failed [${source}] ${url} -> ${err.response?.status ?? err.code ?? err.message}`
        );
        return { data: null, failed: true };
    }
};

const sumIndividualFocus = (lists: any[][]): number =>
    lists.flat().reduce((sum: number, t: any) => sum + (t?.completedTime ?? 0), 0);

const sumGroupFocus = (lists: any[][], userId: string): number =>
    lists.flat().reduce((sum: number, t: any) => {
        const mine = t?.participants?.find((p: any) => String(p?.user?._id ?? p?.user) === userId);
        return sum + (mine?.productivityDone ?? 0);
    }, 0);

export const profileAggregationService = {
    getTaskStats: async (userId: string) => {
        const result = await fetchData<{ tasks: any[] }>(
            "tasks",
            `${serviceUrls().tasks}/api/v1/task/todays-tasks`,
            userId
        );
        const tasks = result.data?.tasks ?? [];
        return {
            failed: result.failed,
            value: {
                totalToday: tasks.length,
                pending: tasks.filter((t: any) => t.status === "pending").length,
                inProgress: tasks.filter((t: any) => t.status === "in-progress").length,
                done: tasks.filter((t: any) => t.status === "done").length,
            },
        } satisfies Stat<unknown>;
    },

    getIndividualTimerStats: async (userId: string): Promise<Stat<TimerBucket>> => {
        const base = `${serviceUrls().productivityTimer}/api/v1/productivity-timer`;
        const [active, completed, expired] = await Promise.all([
            fetchData<any[]>("productivity-timer:active", `${base}/active-productivity-timers`, userId),
            fetchData<any[]>("productivity-timer:completed", `${base}/completed-productivity-timers`, userId),
            fetchData<any[]>("productivity-timer:expired", `${base}/expired-productivity-timers`, userId),
        ]);

        const activeList = active.data ?? [];
        const completedList = completed.data ?? [];
        const expiredList = expired.data ?? [];

        return {
            failed: active.failed || completed.failed || expired.failed,
            value: {
                active: activeList.length,
                completed: completedList.length,
                expired: expiredList.length,
                totalFocusSeconds: sumIndividualFocus([activeList, completedList, expiredList]),
            },
        };
    },

    getGroupTimerStats: async (userId: string): Promise<Stat<TimerBucket>> => {
        const base = `${serviceUrls().groupTimer}/api/v1/group-productivity-timer`;
        const [active, completed, expired] = await Promise.all([
            fetchData<any[]>("group-timer:active", `${base}/active-group-timers`, userId),
            fetchData<any[]>("group-timer:completed", `${base}/completed-group-timers`, userId),
            fetchData<any[]>("group-timer:expired", `${base}/expired-group-timers`, userId),
        ]);

        const activeList = active.data ?? [];
        const completedList = completed.data ?? [];
        const expiredList = expired.data ?? [];

        return {
            failed: active.failed || completed.failed || expired.failed,
            value: {
                active: activeList.length,
                completed: completedList.length,
                expired: expiredList.length,
                totalFocusSeconds: sumGroupFocus([activeList, completedList, expiredList], userId),
            },
        };
    },

    // * All-time task totals (the `tasks` bucket above is *today only*).
    getAllTimeTaskStats: async (userId: string) => {
        const result = await fetchData<{ total: number; done: number; pending: number }>(
            "tasks:all-time",
            `${serviceUrls().tasks}/api/v1/task/all-tasks-stats`,
            userId
        );
        return {
            failed: result.failed,
            value: result.data ?? { total: 0, done: 0, pending: 0 },
        } satisfies Stat<unknown>;
    },

    getStreakAndWeeklyFocus: async (userId: string) => {
        const result = await fetchData<any>(
            "dashboard",
            `${serviceUrls().dashboard}/api/v1/dashboard/summary`,
            userId
        );
        return {
            failed: result.failed,
            value: {
                currentStreak: result.data?.streak?.current ?? 0,
                longestStreak: result.data?.streak?.longest ?? 0,
                weeklyFocusSeconds: result.data?.weeklyFocusSeconds ?? 0,
            },
        };
    },

    getFullProfileStats: async (userId: string) => {
        const [tasks, allTimeTasks, individualTimers, groupTimers, streakData] = await Promise.all([
            profileAggregationService.getTaskStats(userId),
            profileAggregationService.getAllTimeTaskStats(userId),
            profileAggregationService.getIndividualTimerStats(userId),
            profileAggregationService.getGroupTimerStats(userId),
            profileAggregationService.getStreakAndWeeklyFocus(userId),
        ]);

        const unavailable = Object.entries({ tasks, allTimeTasks, individualTimers, groupTimers, streakData })
            .filter(([, result]) => result.failed)
            .map(([name]) => name);

        return {
            tasks: tasks.value,
            allTimeTasks: allTimeTasks.value,
            individualTimers: individualTimers.value,
            groupTimers: groupTimers.value,
            streakData: streakData.value,
            unavailable,
        };
    },
};