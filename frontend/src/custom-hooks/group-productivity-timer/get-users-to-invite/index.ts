import ENDPOINTS from "@/constants/api-endpoints"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { IUser } from "@/pages/Productivity-timer-pages/timer-components/types"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useQuery } from "@tanstack/react-query"

const UserGetUsersToInvite = (query:string) => {
    return useQuery({
        // ? Change the query key below
        queryKey:QUERY_KEYS.PROFILE.USERS_TO_SHOW(query) , 
        queryFn:async () => {
            const response = await apiClient.get(ENDPOINTS.USER_ENDPOINTS.USERS_TO_SHOW(query));
            console.log("UserGetUsersToInvite : " , response.data)
            return response.data as ApiResponse<{users:IUser[] , totalUsers:number}>
        } 
    })
}

export default UserGetUsersToInvite;