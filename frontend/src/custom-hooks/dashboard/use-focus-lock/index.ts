import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/utils/Axios-client";
import { userAppStore } from "@/store";
import { toast } from "sonner";

type SessionType = "individual-timer" | "group-timer" | "pomodoro";

export const useFocusLockStatus = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: ["focus-lock", userId],
        queryFn: async () => (await apiClient.get("/dashboard/focus-lock")).data,
        enabled: !!userId,
        staleTime: 5000,
    });
};

export const useAcquireFocusLock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { sessionType: SessionType; refId: string }) =>
            (await apiClient.post("/dashboard/focus-lock/acquire", payload)).data,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Another session is already active.");
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["focus-lock"] }),
    });
};

export const useReleaseFocusLock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (refId: string) => (await apiClient.post("/dashboard/focus-lock/release", { refId })).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["focus-lock"] }),
    });
};