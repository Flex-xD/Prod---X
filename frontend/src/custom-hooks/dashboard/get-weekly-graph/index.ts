import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { IWeeklyGraphEntry } from "@/types/dashboard";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetWeeklyGraph = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.WEEKLY_GRAPH(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.DASHBOARD_ENDPOINTS.GET_WEEKLY_GRAPH);
            return response.data as ApiResponse<IWeeklyGraphEntry[]>;
        },
        enabled: !!userId,
        staleTime: 1000 * 60,
    });
};

export default useGetWeeklyGraph;