import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetCompletedGroupProductivityTimers = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.COMPLETED_GROUP_TIMERS(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.GET_COMPLETED_GROUP_PRODUCTIVITY_TIMERS);
            return response.data as ApiResponse<IGroupTimer[]>;
        },
        enabled: !!userId,
    });
};

export default useGetCompletedGroupProductivityTimers;