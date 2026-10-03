import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { IProfileData } from "@/types/user";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateUsernameMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const queryKey = QUERY_KEYS.PROFILE_PAGE.DATA(userId);

    return useMutation<
        ApiResponse<{ username: string }>,
        Error | AxiosError,
        { username: string },
        { previous?: ApiResponse<IProfileData> }
    >({
        mutationFn: async ({ username }) => {
            const response = await apiClient.patch(ENDPOINTS.PROFILE_ENDPOINTS.UPDATE_USERNAME, { username });
            return response.data;
        },
        onMutate: async ({ username }) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<ApiResponse<IProfileData>>(queryKey);

            queryClient.setQueryData(queryKey, (old?: ApiResponse<IProfileData>) =>
                old ? { ...old, data: { ...old.data, user: { ...old.data.user, username } } } : old
            );

            return { previous };
        },
        onError: (error, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);

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
            await queryClient.invalidateQueries({ queryKey });
        },
    });
};

export default useUpdateUsernameMutation;