import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ApiResponse } from "@/types/api-response"
import type { IUser } from "@/types/user"
import apiClient from "@/utils/Axios-client"
import { useQuery } from "@tanstack/react-query"

export const useUserData = () => {
    return useQuery({
        queryKey: QUERY_KEYS.PROFILE.ME,
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.USER_ENDPOINTS.USER_DATA);
            console.log('User data fetched : ', response.data);
            return response.data as ApiResponse<IUser>;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}