import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"


const useCreateTaskMutation = (userId: string) => {
    if (!userId) throw new Error("userId is required !");

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskData: ITask) => {
            const response = await apiClient.post(ENDPOINTS.TASKS_ENDPOINTS.CREATE_TASK, {
                taskData
            });
            return response.data as ApiResponse<ITask>;
        },
        onSuccess: async (data) => {
            if (!data?.success) {
                toast.error(data?.message || "Task creation failed !");
                return;
            }
            console.log("Task created successfully : ", data.data);
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.USER(userId) });

            return toast.success(data.message);
        },
        // onSettled: async () => {
        //     // ? For now I am putting the ID from the upcoming data
        // }
        // ,
        onError: (error: AxiosError | Error) => {

            console.log(
                "Error while creating task:",
                error
            );

            let message =
                "Task creation failed!";

            if (
                (error as AxiosError).isAxiosError &&
                (error as AxiosError).response
            ) {

                const responseData =
                    (error as AxiosError)
                        .response?.data as {
                            message?: string;
                        };

                message =
                    responseData?.message ||
                    message;
            }

            toast.error(message);
        }
    })
}

export default useCreateTaskMutation;