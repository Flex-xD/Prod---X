import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { IGroupTimer, IGroupTimerForm } from "@/pages/Productivity-timer-pages/timer-components/types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type AxiosError } from "axios"
import { toast } from "sonner"


const useCreateGroupProductivityTimer = (userId: string) => {
    // if (!userId) return;
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<IGroupTimer>, Error | AxiosError, IGroupTimerForm>({
        mutationFn: async (data) => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.CREATE_GROUP_PRODUCTIVITY_TIMER, {
                data
            });

            if (!response.data.data) {
                return toast.error("Productivity-timer creation failed !");
            }

            return response.data;
        },
        // onMutate: async (newGroupTimer) => {
        //     // ? I am optimistically updating the UI here
        //     await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId) });

        //     const previous =  queryClient.getQueryData(QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId));

        //     // * Fix the type of old below 
        //     await queryClient.setQueryData(QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId), (old: IGroupTimer[] | undefined) => [
        //         ...(old ?? []),
        //         newGroupTimer
        //     ])
        //     return {
        //         previous
        //     };
        // },
        onSettled: async () => {

            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId) });
        },
        onSuccess: async (data) => {
            let failedMessage;
            if (!data?.success) {
                failedMessage = data?.message || "Group-Timer creation failed !"
                toast.error(failedMessage);
                throw Error(failedMessage);
            }
            console.log("Timer created successfully : ", data.data);


            return toast.success(data.message);
        },
        // * Fix the context type below here 
        onError: async (error: Error | AxiosError) => {
            // await queryClient.setQueryData(QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId), context.previous);
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