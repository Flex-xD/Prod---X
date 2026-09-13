import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/Axios-client";
import { toast } from "sonner";
import type { InvitationStatus } from "@/types/notification";
import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { AxiosError } from "axios";

interface IRespondPayload {
    groupTimerId: string;
    notificationId: string;
    status: Extract<InvitationStatus, "accepted" | "declined">;
}

const useRespondToInvitationMutation = (userId:string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: IRespondPayload) => {
            const res = await axiosClient.post(ENDPOINTS.GROUP_TIMER_INVITATION_ENDPOINTS.RESPOND, payload);
            return res.data;
        },
        onSuccess: (_data, variables) => {
            toast.success(
                variables.status === "accepted"
                    ? "Invitation accepted !"
                    : "Invitation declined !"
            );
            queryClient.invalidateQueries({ queryKey:QUERY_KEYS.notificationKeys.list(userId)});
        },
        onError: (error: Error | AxiosError) => {
            const axiosErr = error as AxiosError;
            let message =
                "Invitation response failed to be sent !";

            if (
                axiosErr.isAxiosError &&
                axiosErr.response
            ) {

                const responseData =
                    axiosErr
                        .response?.data as {
                            message?: string;
                        };

                message =
                    responseData?.message ||
                    message;
            }

            toast.error(message);
        },
    });
};

export default useRespondToInvitationMutation;