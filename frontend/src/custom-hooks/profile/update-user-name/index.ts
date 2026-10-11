import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { IProfileData } from "@/types/user";
import type { IUser } from "@/pages/Productivity-timer-pages/timer-components/types";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateUsernameMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const profileKey = QUERY_KEYS.PROFILE_PAGE.DATA(userId);
    const meKey = QUERY_KEYS.PROFILE.ME;

    return useMutation<
        ApiResponse<{ username: string }>,
        Error | AxiosError,
        { username: string },
        { previousProfile?: ApiResponse<IProfileData>; previousMe?: ApiResponse<IUser> }
    >({
        mutationFn: async ({ username }) => {
            const response = await apiClient.patch(ENDPOINTS.PROFILE_ENDPOINTS.UPDATE_USERNAME, { username });
            return response.data;
        },
        onMutate: async ({ username }) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: profileKey }),
                queryClient.cancelQueries({ queryKey: meKey }),
            ]);
            const previousProfile = queryClient.getQueryData<ApiResponse<IProfileData>>(profileKey);
            const previousMe = queryClient.getQueryData<ApiResponse<IUser>>(meKey);

            queryClient.setQueryData<ApiResponse<IProfileData>>(profileKey, (old) =>
                old ? { ...old, data: { ...old.data, user: { ...old.data.user, username } } } : old
            );
            queryClient.setQueryData<ApiResponse<IUser>>(meKey, (old) =>
                old ? { ...old, data: { ...old.data, username } } : old
            );

            return { previousProfile, previousMe };
        },
        onError: (error, _vars, context) => {
            if (context?.previousProfile) queryClient.setQueryData(profileKey, context.previousProfile);
            if (context?.previousMe) queryClient.setQueryData(meKey, context.previousMe);

            let message = "Failed to update username !";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
        onSuccess: (data) => {
            if (data?.success) toast.success(data.message);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKey });
            await queryClient.invalidateQueries({ queryKey: meKey });
        },
    });
};

export default useUpdateUsernameMutation;