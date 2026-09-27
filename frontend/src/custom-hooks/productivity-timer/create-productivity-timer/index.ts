import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { IProductivityTimer, ITimerForm } from "@/pages/Productivity-timer-pages/timer-components/types"
import { userAppStore } from "@/store"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type AxiosError } from "axios"
import { toast } from "sonner"

const useCreateProductivityTimerMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const queryKey = QUERY_KEYS.PRODUCTIVITY_TIMER.ACTIVE_PRODUCTIVIY_TIMERS(userId);

    return useMutation<
        ApiResponse<IProductivityTimer>,
        Error | AxiosError,
        ITimerForm,
        { previous?: ApiResponse<IProductivityTimer[]> }
    >({
        mutationFn: async (data) => {
            const response = await apiClient.post(ENDPOINTS.PRODUCTIVITY_TIMER.CREATE_PRODUCTIVITY_TIMER, { data });
            if (!response.data?.data) {
                throw new Error(response.data?.message || "Productivity-timer creation failed !");
            }
            return response.data;
        },

        onMutate: async (newTimerForm) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<ApiResponse<IProductivityTimer[]>>(queryKey);

            const optimisticTimer: IProductivityTimer = {
                _id: `temp-${Date.now()}`,
                title: newTimerForm.title,
                description: newTimerForm.description,
                deadline: newTimerForm.deadline,
                specifiedTime: newTimerForm.specifiedTime,
                isActive: true,
                status: "pending",
                author: { _id: userId, username: "You", avatar: "", isOnline: true },
                completedTime: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            queryClient.setQueryData(queryKey, (old?: ApiResponse<IProductivityTimer[]>) => ({
                ...(old ?? { statusCode: 200, success: true, message: "", data: [] }),
                data: [optimisticTimer, ...(old?.data ?? [])],
            }));

            return { previous };
        },
        onError: (error, _vars, context) => {
            if (context?.previous !== undefined) queryClient.setQueryData(queryKey, context.previous);

            let message = "Productivity-timer creation failed!";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            toast.error(message);
        },
        onSuccess: (data) => {
            if (data?.success) toast.success(data.message);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey });
        },
    });
};

export default useCreateProductivityTimerMutation;