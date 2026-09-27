import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useArchiveGroupTimerMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const activeKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId);
    const completedKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.COMPLETED_GROUP_TIMERS(userId);

    return useMutation<
        ApiResponse<IGroupTimer>,
        Error | AxiosError,
        { groupTimerId: string },
        { previousActive?: ApiResponse<IGroupTimer[]> }
    >({
        mutationFn: async ({ groupTimerId }) => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.ARCHIVE_GROUP_TIMER, { groupTimerId });
            return response.data;
        },
        onMutate: async ({ groupTimerId }) => {
            await queryClient.cancelQueries({ queryKey: activeKey });
            const previousActive = queryClient.getQueryData<ApiResponse<IGroupTimer[]>>(activeKey);
            const movedTimer = previousActive?.data.find((t) => t._id === groupTimerId);

            queryClient.setQueryData(activeKey, (old?: ApiResponse<IGroupTimer[]>) =>
                old ? { ...old, data: old.data.filter((t) => t._id !== groupTimerId) } : old
            );

            if (movedTimer) {
                queryClient.setQueryData(completedKey, (old?: ApiResponse<IGroupTimer[]>) => ({
                    ...(old ?? { statusCode: 200, success: true, message: "", data: [] }),
                    data: [movedTimer, ...(old?.data.filter((t) => t._id !== groupTimerId) ?? [])],
                }));
            }

            return { previousActive };
        },
        onError: (error: Error | AxiosError, _vars, context) => {
            if (context?.previousActive) queryClient.setQueryData(activeKey, context.previousActive);

            let message = "Failed to archive timer !";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
        onSuccess: (data) => {
            if (data?.success) toast.success("Moved to Completed — you have a free slot now!");
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: activeKey });
            await queryClient.invalidateQueries({ queryKey: completedKey });
        },
    });
};

export default useArchiveGroupTimerMutation;