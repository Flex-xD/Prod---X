import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ITaskData } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"


const useCreateTaskMutation = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({

        mutationFn: async ({title , description}: ITaskData) => {
            if (!userId) {
                throw Error("userID not defined in createTaskMutation !");
            };
            const response = await apiClient.post(ENDPOINTS.TASKS_ENDPOINTS.CREATE_TASK, {
                title , description
            });
            return response.data as ApiResponse<ITaskData>;
        },
        onSuccess: async (data) => {
            let failedMessage;
            if (!data?.success) {
                failedMessage = data?.message || "Task creation failed !"
                toast.error(failedMessage);
                throw Error(failedMessage);
            }
            console.log("Task created successfully : ", data.data);

            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.TODAYS_TASKS(userId) });

            return toast.success(data.message);
        },
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
        },
    })
}

export default useCreateTaskMutation;