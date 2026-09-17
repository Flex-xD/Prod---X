import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface ISubmitGroupProductivityPayload {
    groupTimerId: string;
    productivityDuration: number; 
}

const useSubmitGroupProductivityTimeMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";

    return useMutation<ApiResponse<IGroupTimer>, Error | AxiosError, ISubmitGroupProductivityPayload>({
        mutationFn: async (payload) => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.SUBMIT_GROUP_PRODUCTIVITY, payload);
            return response.data;
        },
        onSuccess: async (data) => {
            if (!data?.success) {
                toast.error(data?.message || "Failed to submit productivity time !");
                return;
            }
            toast.success(data.message);
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId) });
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

export default useSubmitGroupProductivityTimeMutation;