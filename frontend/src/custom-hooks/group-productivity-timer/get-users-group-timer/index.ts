import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query"

const useGetUsersGroupTimers = (userId:string) => {
    return useQuery({
        queryKey:QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId) , 
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.GET_USERS_GROUP_PRODUCTIVITY_TIMER);
            return response.data as ApiResponse<IGroupTimer>;
        } , 
        // enabled:userId!!
    })
};

export default useGetUsersGroupTimers;