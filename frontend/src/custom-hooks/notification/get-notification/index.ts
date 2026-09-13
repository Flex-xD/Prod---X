import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/Axios-client";
import type { IGetNotificationsData } from "@/types/notification";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { ApiResponse } from "@/types/api-response";
import ENDPOINTS from "@/constants/api-endpoints";

const useGetNotifications = (userId: string, page: number = 1) => {
    return useQuery<ApiResponse<IGetNotificationsData>>({
        queryKey:QUERY_KEYS.notificationKeys.all,
        queryFn: async () => {
            const response = await axiosClient.get(ENDPOINTS.NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS(userId, page));
            return response.data;
        },
        enabled: !!userId,
        staleTime: 1000 * 30,
    });
};

export default useGetNotifications;