import ENDPOINTS from "@/constants/api-endpoints"
import { userAppStore } from "@/store"
import type { ApiResponse } from "@/types/api-response"
import apiClient from "@/utils/Axios-client"
import { useMutation } from "@tanstack/react-query"
import { AxiosError, HttpStatusCode } from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useLogoutMutation = () => {
    const setIsAuthenticated =
        userAppStore(
            (state) => state.setIsAuthenticated
        );


    const clearAccessToken =
        userAppStore(
            (state) => state.clearAccessToken
        ); const navigate = useNavigate();
    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.post<ApiResponse<null>>(ENDPOINTS.AUTH_ENDPOINTS.LOGOUT);
            if (response.data.statusCode !== HttpStatusCode.Ok) {
                toast.error(response.data.message || "Logout failed !");
                return;
            }
            clearAccessToken();
            setIsAuthenticated(false);

            console.log(
                "Logout state:",
                userAppStore.getState()
            );
            
            return response.data;
        },
        onSuccess: async (data) => {
            await navigate("/");
            return toast.success(data?.message || "Logout successfully done !")
        },
        onError: (error: AxiosError | Error) => {
            console.log("Error while logging out : ", error);
            let message = 'User Logout failed !';

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
            return;

        }
    })
}