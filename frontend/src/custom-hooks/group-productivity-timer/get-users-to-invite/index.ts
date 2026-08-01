import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { ApiResponse } from "@/types/api-response"
import type { IUser } from "@/types/user"
import apiClient from "@/utils/Axios-client"
import { useQuery } from "@tanstack/react-query"

const getUsersToInvite = () => {
    return useQuery({
        queryKey:QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.MY_TIMERS , 
        queryFn:async () => {
            const response = await apiClient.get(ENDPOINTS.GROUP_PRODUCTITIVTY_TIMER.GET_USERS_GROUP_PRODUCTIVITY_TIMER);
            return response.data as ApiResponse<IUser[]>
        } 
    })
}

export default getUsersToInvite;