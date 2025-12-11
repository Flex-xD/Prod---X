import ENDPOINTS from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api-response";
import type { IUser } from "@/types/user";
import apiClient from "@/utils/Axios-client";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useRegisterMutation = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (formdata: { email: string, username: string, password: string }) => {
            const response = await apiClient.post(ENDPOINTS.AUTH_ENDPOINTS.REGISTER, formdata);
            return response.data as ApiResponse<IUser>;
        },
        onSuccess: (data) => {
            if (!data?.success) {
                toast.error(data?.message || "User registeration failed");
                return;
            }
            console.log("User registered successfully : ", data.data.email);
            toast.success(data.message);
            navigate("/dashboard");
            return;
        },
        onError: (error: AxiosError | Error) => {
            console.log("Error while registering user : ", error);

            let message = `User registeration failed!`;

            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }

            toast.error(message);
            return;
        }
    })
}

export default useRegisterMutation;