import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { IProductivityTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface ISubmitProductivityPayload {
    productivityTimerId: string;
    productivityDuration: number; 
}

const useSubmitProductivityTimeMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const activeKey = QUERY_KEYS.PRODUCTIVITY_TIMER.ACTIVE_PRODUCTIVIY_TIMERS(userId);
    const completedKey = QUERY_KEYS.PRODUCTIVITY_TIMER.COMPLETED_PRODUCTIVITY_TIMERS(userId);

    return useMutation<ApiResponse<IProductivityTimer>, Error | AxiosError, ISubmitProductivityPayload>({
        mutationFn: async (payload) => {
            const response = await apiClient.post(ENDPOINTS.PRODUCTIVITY_TIMER.SUBMIT_PRODUCTIVITY, payload);
            return response.data;
        },
        onSuccess: async (data) => {
            if (!data?.success) {
                toast.error(data?.message || "Failed to submit productivity time !");
                return;
            }
            toast.success(data.message);

            const updatedTimer = data.data;

            queryClient.setQueryData(activeKey, (old?: ApiResponse<IProductivityTimer[]>) => {
                if (!old) return old;
                if (updatedTimer.status === "done") {
                    return { ...old, data: old.data.filter((t) => t._id !== updatedTimer._id) };
                }
                return { ...old, data: old.data.map((t) => (t._id === updatedTimer._id ? updatedTimer : t)) };
            });

            if (updatedTimer.status === "done") {
                queryClient.setQueryData(completedKey, (old?: ApiResponse<IProductivityTimer[]>) => ({
                    ...(old ?? { statusCode: 200, success: true, message: "", data: [] }),
                    data: [updatedTimer, ...(old?.data.filter((t) => t._id !== updatedTimer._id) ?? [])],
                }));
            }

            await queryClient.invalidateQueries({ queryKey: activeKey });
            if (updatedTimer.status === "done") {
                await queryClient.invalidateQueries({ queryKey: completedKey });
            }
        },
        onError: (error: Error | AxiosError) => {
            let message = "Failed to submit productivity time !";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
    });
};

export default useSubmitProductivityTimeMutation;