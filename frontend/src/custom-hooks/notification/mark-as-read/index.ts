import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/Axios-client";
import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";


// * I have to add onErrors later on to both the mutations
export const useMarkAsReadMutation = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (notificationId: string) => {
            const res = await axiosClient.patch(ENDPOINTS.NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId), { userId });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationKeys.list(userId) }),
    });
};

export const useMarkAllAsReadMutation = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await axiosClient.patch(ENDPOINTS.NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ(userId));
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationKeys.list(userId) }),
    });
};