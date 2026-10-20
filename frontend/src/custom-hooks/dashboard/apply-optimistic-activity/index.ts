import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { ApiResponse } from "@/types/api-response";
import type { IDashboardSummary, IWeeklyGraphEntry, ICalendarCell } from "@/types/dashboard";
import type { IProfileData } from "@/types/user";

export interface ActivityDelta {
    tasksCreated?: number;
    tasksCompleted?: number;
    /** Focus seconds added to summary/weekly/calendar (all focus types). */
    focusSeconds?: number;
    /**
     * How much of `focusSeconds` should bump the profile's *individual timer*
     * total. Defaults to `focusSeconds`; pass 0 for focus that does not come
     * from an individual timer (group submits, pomodoro sessions).
     */
    profileFocusSeconds?: number;
    /** Focus seconds that belong to the profile's *group timer* total. */
    groupFocusSeconds?: number;
}

export interface DashboardOptimisticContext {
    previousSummary?: ApiResponse<IDashboardSummary>;
    previousWeekly?: ApiResponse<IWeeklyGraphEntry[]>;
    previousCalendar?: ApiResponse<ICalendarCell[][]>;
    previousProfile?: ApiResponse<IProfileData>;
}

const reconciliationTimers = new Map<string, ReturnType<typeof setTimeout>>();

const toServerDateKey = (d: Date = new Date()): string => d.toISOString().slice(0, 10);

const deriveIntensity = (focusSeconds: number, tasks: number): ICalendarCell["intensity"] => {
    const hours = focusSeconds / 3600;
    if (hours >= 3) return "high";
    if (hours >= 1) return "medium";
    if (hours > 0 || tasks > 0) return "low";
    return "none";
};

export const applyOptimisticDashboardUpdate = async (
    queryClient: QueryClient,
    userId: string,
    delta: ActivityDelta
): Promise<DashboardOptimisticContext> => {
    const summaryKey = QUERY_KEYS.DASHBOARD.SUMMARY(userId);
    const weeklyKey = QUERY_KEYS.DASHBOARD.WEEKLY_GRAPH(userId);
    const calendarKey = QUERY_KEYS.DASHBOARD.CALENDAR(userId);
    const profileKey = QUERY_KEYS.PROFILE_PAGE.DATA(userId);

    await Promise.all([
        queryClient.cancelQueries({ queryKey: summaryKey }),
        queryClient.cancelQueries({ queryKey: weeklyKey }),
        queryClient.cancelQueries({ queryKey: calendarKey }),
        queryClient.cancelQueries({ queryKey: profileKey }),
    ]);

    const context: DashboardOptimisticContext = {
        previousSummary: queryClient.getQueryData<ApiResponse<IDashboardSummary>>(summaryKey),
        previousWeekly: queryClient.getQueryData<ApiResponse<IWeeklyGraphEntry[]>>(weeklyKey),
        previousCalendar: queryClient.getQueryData<ApiResponse<ICalendarCell[][]>>(calendarKey),
        previousProfile: queryClient.getQueryData<ApiResponse<IProfileData>>(profileKey),
    };

    const today = toServerDateKey();
    const created = delta.tasksCreated ?? 0;
    const completed = delta.tasksCompleted ?? 0;
    const focus = delta.focusSeconds ?? 0;
    const profileFocus = delta.profileFocusSeconds ?? focus;
    const groupFocus = delta.groupFocusSeconds ?? 0;

    queryClient.setQueryData<ApiResponse<IDashboardSummary>>(summaryKey, (old) => {
        if (!old) return old;
        return {
            ...old,
            data: {
                ...old.data,
                tasksToday: {
                    created: Math.max(0, old.data.tasksToday.created + created),
                    completed: Math.max(0, old.data.tasksToday.completed + completed),
                },
                weeklyFocusSeconds: Math.max(0, old.data.weeklyFocusSeconds + focus),
            },
        };
    });

    queryClient.setQueryData<ApiResponse<IWeeklyGraphEntry[]>>(weeklyKey, (old) => {
        if (!old) return old;
        return {
            ...old,
            data: old.data.map((entry) => {
                if (entry.day !== "Today" && entry.date !== today) return entry;
                return {
                    ...entry,
                    tasks: Math.max(0, entry.tasks + completed),
                    focusSeconds: Math.max(0, entry.focusSeconds + focus),
                };
            }),
        };
    });

    queryClient.setQueryData<ApiResponse<ICalendarCell[][]>>(calendarKey, (old) => {
        if (!old) return old;
        return {
            ...old,
            data: old.data.map((week) =>
                week.map((cell) => {
                    if (cell.date !== today) return cell;
                    const focusSeconds = Math.max(0, (cell.focusSeconds ?? 0) + focus);
                    const tasks = Math.max(0, (cell.tasks ?? 0) + completed);
                    return {
                        ...cell,
                        focusSeconds,
                        tasks,
                        hours: Math.round((focusSeconds / 3600) * 100) / 100,
                        intensity: deriveIntensity(focusSeconds, tasks),
                    };
                })
            ),
        };
    });

    queryClient.setQueryData<ApiResponse<IProfileData>>(profileKey, (old) => {
        if (!old) return old;
        const { tasks, individualTimers, groupTimers, allTimeTasks } = old.data.stats;
        return {
            ...old,
            data: {
                ...old.data,
                stats: {
                    ...old.data.stats,
                    tasks: {
                        ...tasks,
                        totalToday: Math.max(0, tasks.totalToday + created),
                        done: Math.max(0, tasks.done + completed),
                        pending: Math.max(0, tasks.pending + created - completed),
                    },
                    // ? Only present after the all-time-stats payload arrives;
                    // * older cached shapes simply skip it and reconcile later.
                    ...(allTimeTasks
                        ? {
                            allTimeTasks: {
                                total: Math.max(0, allTimeTasks.total + created),
                                done: Math.max(0, allTimeTasks.done + completed),
                                pending: Math.max(0, allTimeTasks.pending + created - completed),
                            },
                        }
                        : {}),
                    individualTimers: {
                        ...individualTimers,
                        totalFocusSeconds: Math.max(0, individualTimers.totalFocusSeconds + profileFocus),
                    },
                    ...(groupTimers
                        ? {
                            groupTimers: {
                                ...groupTimers,
                                totalFocusSeconds: Math.max(0, groupTimers.totalFocusSeconds + groupFocus),
                            },
                        }
                        : {}),
                },
            },
        };
    });

    return context;
};

export const rollbackDashboardOptimisticUpdate = (
    queryClient: QueryClient,
    userId: string,
    context?: DashboardOptimisticContext
) => {
    if (!context) return;
    if (context.previousSummary) queryClient.setQueryData(QUERY_KEYS.DASHBOARD.SUMMARY(userId), context.previousSummary);
    if (context.previousWeekly) queryClient.setQueryData(QUERY_KEYS.DASHBOARD.WEEKLY_GRAPH(userId), context.previousWeekly);
    if (context.previousCalendar) queryClient.setQueryData(QUERY_KEYS.DASHBOARD.CALENDAR(userId), context.previousCalendar);
    if (context.previousProfile) queryClient.setQueryData(QUERY_KEYS.PROFILE_PAGE.DATA(userId), context.previousProfile);
};

export const reconcileDashboardAfterDelay = (
    queryClient: QueryClient,
    userId: string,
    delayMs = 3000
) => {
    const existing = reconciliationTimers.get(userId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY(userId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.WEEKLY_GRAPH(userId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.CALENDAR(userId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE_PAGE.DATA(userId) });
        reconciliationTimers.delete(userId);
    }, delayMs);

    reconciliationTimers.set(userId, timer);
};