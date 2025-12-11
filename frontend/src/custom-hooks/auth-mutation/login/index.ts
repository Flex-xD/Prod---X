import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { ApiResponse } from "@/types/api-response";
import type { IUser } from "@/types/user";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (formdata: { email: string, password: string }) => {
            const response = await apiClient.post(ENDPOINTS.AUTH_ENDPOINTS.LOGIN, formdata);
            return response.data as ApiResponse<IUser>;
        },
        onSuccess: async (data) => {
            if (!data?.success) {
                toast.error(data?.message || "User login failed");
                return;
            }
            console.log("User logged in successfully : ", data.data.email);
            toast.success(data.message);
            await navigate("/dashboard");
            return;
        },
        onSettled:async () => {
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.ME });
        } ,
        onError: (error: AxiosError | Error) => {
            console.log("Error while logging in user : ", error);

            let message = `User login failed!`;

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }

            toast.error(message);
            return;
        }
    })
}

export default useLoginMutation;