import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ITimerForm } from "@/pages/Productivity-timer-pages/timer-components/types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {  type AxiosError } from "axios"
import { toast } from "sonner"


const useCreateProductivityTimerMutation = () => {
    // const queryClient = useQueryClient();
    // ? invalidate the queries when the useQueryClientWillBeFetched
    return useMutation<ApiResponse<ITimerForm>, Error | AxiosError, ITimerForm>({
        mutationFn: async (data) => {
            const response = await apiClient.post(ENDPOINTS.PRODUCTIVITY_TIMER.CREATE_PRODUCTIVITY_TIMER,{
                data
            });

            if (!response.data.data) {
                return toast.error("GroupProductivity-timer creation failed !");
            }

            return response.data;
        },
        onSuccess: async (data) => {
            let failedMessage;
            if (!data?.success) {
                failedMessage = data?.message || "Group-productivity-timer creation failed !"
                toast.error(failedMessage);
                throw Error(failedMessage);
            }
            console.log("Timer created successfully : ", data.data);

            // await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.TODAYS_TASKS() });

            return toast.success(data.message);
        },
        onError: async (error: Error | AxiosError) => {

            console.log(
                "Error while creating Group-productivity-timer :",
                error
            );

            let message =
                "Group-productivity-timer  creation failed!";

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

export default useCreateProductivityTimerMutation;