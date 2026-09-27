import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { IProductivityTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetCompletedProductivityTimer = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTIVITY_TIMER.COMPLETED_PRODUCTIVITY_TIMERS(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.PRODUCTIVITY_TIMER.GET_COMPLETED_PRODUCTIVITY_TIMERS);
            return response.data as ApiResponse<IProductivityTimer[]>;
        },
        enabled: !!userId,
    });
};

export default useGetCompletedProductivityTimer;