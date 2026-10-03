import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { IProfileData } from "@/types/user";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateAvatarMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const queryKey = QUERY_KEYS.PROFILE_PAGE.DATA(userId);

    return useMutation<
        ApiResponse<{ avatar: string }>,
        Error | AxiosError,
        File,
        { previous?: ApiResponse<IProfileData>; previewUrl?: string }
    >({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("avatar", file);
            const response = await apiClient.post(ENDPOINTS.PROFILE_ENDPOINTS.UPDATE_AVATAR, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        },
        onMutate: async (file) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<ApiResponse<IProfileData>>(queryKey);

            // ? Instant local preview via object URL while the real upload is in flight
            const previewUrl = URL.createObjectURL(file);
            queryClient.setQueryData(queryKey, (old?: ApiResponse<IProfileData>) =>
                old ? { ...old, data: { ...old.data, user: { ...old.data.user, avatar: previewUrl } } } : old
            );

            return { previous, previewUrl };
        },
        onError: (error, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
            if (context?.previewUrl) URL.revokeObjectURL(context.previewUrl);

            let message = "Failed to update avatar !";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
        onSuccess: (data, _vars, context) => {
            if (context?.previewUrl) URL.revokeObjectURL(context.previewUrl);
            if (data?.success) toast.success(data.message);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey });
        },
    });
};

export default useUpdateAvatarMutation;