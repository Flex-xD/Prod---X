import ENDPOINTS from "@/constants/api-endpoints"
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"



const addTaskMutation = () => {
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
            console.log("User created successfully : ", data.data);
            return toast.success(data.message);
        }, 
        onSettled:() => {
            
        }
        ,
        onError: (error: AxiosError | Error) => {
            console.log("Error while registering user : ", error);

            let message = `User registeration failed!`;

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }

            toast.error(message);
            return;
        }
    })
}

export default addTaskMutation;