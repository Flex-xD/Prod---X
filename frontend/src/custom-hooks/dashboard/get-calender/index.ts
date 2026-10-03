import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { ICalendarCell } from "@/types/dashboard";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetCalendar = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.CALENDAR(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.DASHBOARD_ENDPOINTS.GET_CALENDAR());
            return response.data as ApiResponse<ICalendarCell[][]>;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });
};

export default useGetCalendar;