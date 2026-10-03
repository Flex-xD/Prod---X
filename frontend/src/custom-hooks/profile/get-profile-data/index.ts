import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { IProfileData } from "@/types/user";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query";

const useGetProfileData = () => {
    const userId = userAppStore((state) => state.user_id) ?? "";
    return useQuery({
        queryKey: QUERY_KEYS.PROFILE_PAGE.DATA(userId),
        queryFn: async () => {
            const response = await apiClient.get(ENDPOINTS.PROFILE_ENDPOINTS.GET_PROFILE);
            return response.data as ApiResponse<IProfileData>;
        },
        enabled: !!userId,
        staleTime: 1000 * 30,
    });
};

export default useGetProfileData;