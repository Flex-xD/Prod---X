import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { IGroupTimer, IGroupTimerForm } from "@/pages/Productivity-timer-pages/timer-components/types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {  type AxiosError } from "axios"
import { toast } from "sonner"


const useCreateGroupProductivityTimer = () => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<IGroupTimer>, Error | AxiosError, IGroupTimerForm>({
        mutationFn: async (data) => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.CREATE_GROUP_PRODUCTIVITY_TIMER,{
                data
            });

            if (!response.data.data) {
                return toast.error("Productivity-timer creation failed !");
            }

            return response.data;
        },
        onSuccess: async (data) => {
            let failedMessage;
            if (!data?.success) {
                failedMessage = data?.message || "Group-Timer creation failed !"
                toast.error(failedMessage);
                throw Error(failedMessage);
            }
            console.log("Timer created successfully : ", data.data);

            // ? I have to invalidate the queries also
            await queryClient.invalidateQueries({queryKey:QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.MY_TIMERS})

            return toast.success(data.message);
        },
        onError: async (error: Error | AxiosError) => {

            console.log(
                "Error while creating group-productivity-timer:",
                error
            );

            let message =
                "Group-productivity-timer creation failed!";

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

export default useCreateGroupProductivityTimer;