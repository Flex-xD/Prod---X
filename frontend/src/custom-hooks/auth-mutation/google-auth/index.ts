import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import type { ILoginResponseData, IUser } from "@/types/user";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const useGoogleAuth = () => {
    const queryClient = useQueryClient();
    const { setAccessToken, setIsAuthenticated, setUserId } = userAppStore.getState();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (idToken: any) => {
            const response = await apiClient.post(ENDPOINTS.AUTH_ENDPOINTS.GOOGLE_AUTH, { idToken });
            return response.data as ApiResponse<ILoginResponseData>;
        },
        onSuccess: async (data) => {
            if (!data?.success) {
                toast.error(data?.message || "User login failed");
                return;
            }
            setIsAuthenticated(true);
            setAccessToken(data.data.accessToken);
            setUserId(data.data.user._id);

            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.ME });

            console.log("User logged in successfully : ", data.data);
            toast.success(data.message);
            return await navigate("/dashboard");
        },
        onError: (error: AxiosError | Error) => {
            console.log("Error while logging in user with google auth : ", error);

            let message = `User Google auth failed!`;

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }

            toast.error(message);
            return;
        }
    })
}

export default useGoogleAuth;