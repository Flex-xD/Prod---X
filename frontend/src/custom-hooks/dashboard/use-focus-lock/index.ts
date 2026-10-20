import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/utils/Axios-client";
import { userAppStore } from "@/store";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";
import {
    applyOptimisticDashboardUpdate,
    reconcileDashboardAfterDelay,
    rollbackDashboardOptimisticUpdate,
    type DashboardOptimisticContext,
} from "@/custom-hooks/dashboard/apply-optimistic-activity";

type SessionType = "individual-timer" | "group-timer" | "pomodoro";

interface IFocusLock {
    sessionType: SessionType;
    refId: string;
    isRunning: boolean;
    accumulatedSeconds: number;
    startedAt: string;
}

export const useFocusLockStatus = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.FOCUS_LOCK(userId),
        queryFn: async () => (await apiClient.get("/dashboard/focus-lock")).data,
        enabled: !!userId,
        staleTime: 5000,
    });
};

export const useAcquireFocusLock = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useMutation({
        mutationFn: async (payload: { sessionType: SessionType; refId: string }) =>
            (await apiClient.post("/dashboard/focus-lock/acquire", payload)).data,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Another session is already active.");
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.FOCUS_LOCK(userId) }),
    });
};

export const usePauseFocusLock = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useMutation({
        mutationFn: async (payload: { refId: string; elapsedSinceStart: number }) =>
            (await apiClient.post("/dashboard/focus-lock/pause", payload)).data,
        onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.FOCUS_LOCK(userId) }),
    });
};

export const useReleaseFocusLock = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useMutation({
        mutationFn: async (refId: string) => (await apiClient.post("/dashboard/focus-lock/release", { refId })).data,
        onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.FOCUS_LOCK(userId) }),
    });
};

/**
 * Logs a finished/partial pomodoro session to the backend so it counts as
 * productivity (daily focus, weekly graph, calendar, streak) and releases the
 * focus lock in the same call.
 */
export const useLogPomodoroFocus = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";

    return useMutation<
        unknown,
        any,
        { seconds: number },
        { dashboard?: DashboardOptimisticContext }
    >({
        mutationFn: async ({ seconds }) =>
            (await apiClient.post("/dashboard/log-pomodoro", { seconds })).data,
        onMutate: async ({ seconds }) => {
            const dashboard = await applyOptimisticDashboardUpdate(queryClient, userId, {
                focusSeconds: seconds,
                // ? Pomodoro time is not part of the profile's *timer* totals —
                // * it lives in the dashboard's daily-activity focus numbers.
                profileFocusSeconds: 0,
            });
            return { dashboard };
        },
        onSuccess: () => {
            toast.success("Pomodoro session logged as productivity !");
        },
        onError: (error: any, _vars, context) => {
            rollbackDashboardOptimisticUpdate(queryClient, userId, context?.dashboard);
            toast.error(error?.response?.data?.message || "Failed to log pomodoro session !");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.FOCUS_LOCK(userId) });
            reconcileDashboardAfterDelay(queryClient, userId);
        },
    });
};

// * Kept for consumers that only need the raw lock shape.
export type { IFocusLock };
