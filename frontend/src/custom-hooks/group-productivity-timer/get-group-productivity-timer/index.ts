import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetActiveGroupProductivityTimers = () => {
    const userId = userAppStore((state) => state.user_id);
    return useQuery({
        queryKey:[QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.USER_GROUP_TIMER] , 
        queryFn:async () => {
            const response = await apiClient.post(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.GET_USERS_ACTIVE_GROUP_PRODUCTIVITY_TIMERS);
            if (!response.data) {
                throw Error("User's Active Productivity Timers not fetched !");
            }
            return response.data as ApiResponse<IGroupTimer[]>;
        } , 
        enabled:!!userId

    })
};

export default useGetActiveGroupProductivityTimers;