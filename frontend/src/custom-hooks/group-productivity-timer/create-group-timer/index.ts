import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { IGroupTimer, IGroupTimerForm } from "@/pages/Productivity-timer-pages/timer-components/types";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "sonner";

const useCreateGroupProductivityTimer = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    const queryClient = useQueryClient();
    const queryKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId);

    return useMutation<
        ApiResponse<IGroupTimer>,
        Error | AxiosError,
        IGroupTimerForm,
        { previous?: ApiResponse<IGroupTimer[]> }
    >({
        mutationFn: async (data) => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.CREATE_GROUP_PRODUCTIVITY_TIMER, { data });

            if (!response.data?.data) {
                throw new Error(response.data?.message || "Group-Timer creation failed !");
            }
            return response.data;
        },

        onMutate: async (newTimerForm) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<ApiResponse<IGroupTimer[]>>(queryKey);

            const optimisticTimer: IGroupTimer = {
                _id: `temp-${Date.now()}`,
                title: newTimerForm.title,
                description: newTimerForm.description,
                deadline: newTimerForm.deadline,
                specifiedTime: newTimerForm.specifiedTime,
                invitedUsersId: newTimerForm.invitedUsersId,
                status: "pending",
                isActive: true,
                participants: [{
                    user: { _id: userId, username: "You", avatar: "", isOnline: true },
                    productivityDone: 0, isCurrentlyActive: false, rank: 1,
                    hasCompleted: false, archived: false,
                }],
                author: { _id: userId, username: "You", avatar: "", isOnline: true },
                isJoined: true,
            };

            queryClient.setQueryData(queryKey, (old?: ApiResponse<IGroupTimer[]>) => ({
                ...(old ?? { statusCode: 200, success: true, message: "", data: [] }),
                data: [optimisticTimer, ...(old?.data ?? [])],
            }));

            return { previous };
        },
        onError: (error, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);

            let message = "Group-productivity-timer creation failed!";
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

export default useCreateGroupProductivityTimer;