import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types"
import { userAppStore } from "@/store"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export const useToggleTaskMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id);
    // if (!userId) {
    //     return toast.error("User ID not found !");
    // }
    return useMutation<ApiResponse<ITask>, Error | AxiosError, { taskId: string; isTaskPending: boolean }>({
        mutationFn: async ({ taskId, isTaskPending }) => {
            const endPoint = isTaskPending ? ENDPOINTS.TASKS_ENDPOINTS.MARK_TASK_DONE : ENDPOINTS.TASKS_ENDPOINTS.MARK_TASK_PENDING
            const response = await apiClient.post(endPoint, {
                taskId
            })
            return response.data as ApiResponse<ITask>;
        },
        onSuccess: async (data) => {
            if (data.statusCode !== 200) {
                toast.error(data.message);
                throw Error("Error while updating task's status.")
            }
            toast.success(data.message);
            // await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.BY_ID(taskId) });
            // ? see is you need to invalidate individual task or just today's tasks
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.TODAYS_TASKS(userId as string) });
        },
        onError: (error: Error | AxiosError) => {
            console.log("Error while updating task's status :", error);

            let message;

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message: string }
                message = responseData.message || message;
            }

            toast.error(message);
        }
    })
}