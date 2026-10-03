import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetAiTip = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.AI_TIP(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.DASHBOARD_ENDPOINTS.GET_AI_TIP);
            return response.data as ApiResponse<{ tip: string }>;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 60,
    });
};

export default useGetAiTip;