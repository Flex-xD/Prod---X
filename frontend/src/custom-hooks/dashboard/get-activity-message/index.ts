import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetActivityMessage = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.ACTIVITY_MESSAGE(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.DASHBOARD_ENDPOINTS.GET_ACTIVITY_MESSAGE);
            return response.data as ApiResponse<{ message: string }>;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2, 
    });
};

export default useGetActivityMessage;