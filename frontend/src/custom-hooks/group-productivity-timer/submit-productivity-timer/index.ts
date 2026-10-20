import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import {
    applyOptimisticDashboardUpdate,
    reconcileDashboardAfterDelay,
    rollbackDashboardOptimisticUpdate,
    type DashboardOptimisticContext,
} from "@/custom-hooks/dashboard/apply-optimistic-activity";

interface ISubmitGroupProductivityPayload {
    groupTimerId: string;
    productivityDuration: number;
}

const useSubmitGroupProductivityTimeMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const activeKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId);

    return useMutation<
        ApiResponse<IGroupTimer>,
        Error | AxiosError,
        ISubmitGroupProductivityPayload,
        { dashboard?: DashboardOptimisticContext }
    >({
        mutationFn: async (payload) => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.SUBMIT_GROUP_PRODUCTIVITY, payload);
            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to submit productivity time !");
            }
            return response.data;
        },
        // * Optimistically bump dashboard stats (weekly focus, calendar, streak
        // * activity + profile group-timer total) so the dashboard needs no reload.
        onMutate: async ({ productivityDuration }) => {
            const dashboard = await applyOptimisticDashboardUpdate(queryClient, userId, {
                focusSeconds: productivityDuration,
                profileFocusSeconds: 0,
                groupFocusSeconds: productivityDuration,
            });
            return { dashboard };
        },
        onSuccess: async (data) => {
            toast.success(data.message);

            const updatedTimer = data.data;
            queryClient.setQueryData(activeKey, (old?: ApiResponse<IGroupTimer[]>) => {
                if (!old) return old;
                return { ...old, data: old.data.map((t) => (t._id === updatedTimer._id ? updatedTimer : t)) };
            });

            await queryClient.invalidateQueries({ queryKey: activeKey });
        },
        onError: (error: Error | AxiosError, _vars, context) => {
            rollbackDashboardOptimisticUpdate(queryClient, userId, context?.dashboard);

            let message = "Failed to submit productivity time !";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
        onSettled: async () => {
            reconcileDashboardAfterDelay(queryClient, userId);
        },
    });
};

export default useSubmitGroupProductivityTimeMutation;