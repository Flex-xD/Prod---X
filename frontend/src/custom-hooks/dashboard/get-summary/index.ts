import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { IDashboardSummary } from "@/types/dashboard";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetDashboardSummary = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.SUMMARY(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.DASHBOARD_ENDPOINTS.GET_SUMMARY);
            return response.data as ApiResponse<IDashboardSummary>;
        },
        enabled: !!userId,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60, 
    });
};

export default useGetDashboardSummary;