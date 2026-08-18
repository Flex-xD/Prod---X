import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { IProductivityTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query"

const useGetProductivityTimer = (userId:string) => {
    return useQuery({
        queryKey:QUERY_KEYS.PRODUCTIVITY_TIMER.ACTIVE_PRODUCTIVIY_TIMERS(userId) , 
        queryFn:async () => {
            const response = await apiClient.get(ENDPOINTS.PRODUCTIVITY_TIMER.GET_PRODUCTIVITY_TIMERS);
            if (!response.data) {
                throw Error("Productivity-timers not fetched !");
            }
            console.log("This is the response data of getProductivityTimers : ",response.data)
            return response.data as ApiResponse<IProductivityTimer>;
        } , 
        enabled:!!userId
        // ? Add suitable refetch interval
        // refetchInterval:
    })
}

export default useGetProductivityTimer;