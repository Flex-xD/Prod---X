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

const useUpdateAvatarMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const profileKey = QUERY_KEYS.PROFILE_PAGE.DATA(userId);
    const meKey = QUERY_KEYS.PROFILE.ME;

    const writeAvatar = (avatar: string) => {
        queryClient.setQueryData<ApiResponse<IProfileData>>(profileKey, (old) =>
            old ? { ...old, data: { ...old.data, user: { ...old.data.user, avatar } } } : old
        );
        queryClient.setQueryData<ApiResponse<IUser>>(meKey, (old) =>
            old ? { ...old, data: { ...old.data, avatar } } : old
        );
    };

    return useMutation<
        ApiResponse<{ avatar: string }>,
        Error | AxiosError,
        File,
        { previousProfile?: ApiResponse<IProfileData>; previousMe?: ApiResponse<IUser>; previewUrl?: string }
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
            await Promise.all([
                queryClient.cancelQueries({ queryKey: profileKey }),
                queryClient.cancelQueries({ queryKey: meKey }),
            ]);
            const previousProfile = queryClient.getQueryData<ApiResponse<IProfileData>>(profileKey);
            const previousMe = queryClient.getQueryData<ApiResponse<IUser>>(meKey);
            const previewUrl = URL.createObjectURL(file);
            writeAvatar(previewUrl);
            return { previousProfile, previousMe, previewUrl };
        },
        onError: (error, _vars, context) => {
            if (context?.previousProfile) queryClient.setQueryData(profileKey, context.previousProfile);
            if (context?.previousMe) queryClient.setQueryData(meKey, context.previousMe);
            if (context?.previewUrl) URL.revokeObjectURL(context.previewUrl);

            let message = "Failed to update avatar !";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
        onSuccess: (data, _vars, context) => {
            if (data?.success && data.data?.avatar) writeAvatar(data.data.avatar);
            if (context?.previewUrl) URL.revokeObjectURL(context.previewUrl);
            if (data?.success) toast.success(data.message);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKey });
            await queryClient.invalidateQueries({ queryKey: meKey });
        },
    });
};

export default useUpdateAvatarMutation;