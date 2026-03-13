import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"


const useCreateTaskMutation = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskData: ITask) => {
            const response = await apiClient.post(ENDPOINTS.TASKS_ENDPOINTS.CREATE_TASK, {
                taskData
            });
            return response.data as ApiResponse<ITask>;
        },
        onSuccess: (data) => {
            if (!data?.success) {
                toast.error(data?.message || "Task creation failed !");
                return;
            }
            console.log("Task created successfully : ", data.data);
            return toast.success(data.message);
        }, 
        onSettled:async() => {
            // ? For now I am putting the ID from the upcoming data
            // await queryClient.invalidateQueries({queryKey:QUERY_KEYS.TASKS.BY_ID(data?.data.id)});
        }
        ,
        onError: (error: AxiosError | Error) => {
            console.log("Error while registering user : ", error);

            let message = `Task creation failed !`;

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }

            toast.error(message);
            return;
        }
    })
}

export default useCreateTaskMutation;