import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/Axios-client";
import { toast } from "sonner";
import type { InvitationStatus } from "@/types/notification";
import type { IGetNotificationsData } from "@/types/notification";
import type { IGroupTimer } from "@/pages/Productivity-timer-pages/timer-components/types";
import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { ApiResponse } from "@/types/api-response";
import type { AxiosError } from "axios";

interface IRespondPayload {
    groupTimerId: string;
    status: Extract<InvitationStatus, "accepted" | "declined">;
    timer?: IGroupTimer;
}

const useRespondToInvitationMutation = (userId: string) => {
    const queryClient = useQueryClient();
    const pendingKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.PENDING_INVITES(userId);
    const notificationsKey = QUERY_KEYS.notificationKeys.list(userId);
    const activeGroupKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId);

    return useMutation({
        mutationFn: async (payload: IRespondPayload) => {
            const { timer, ...body } = payload; 
            const res = await axiosClient.post(ENDPOINTS.GROUP_TIMER_INVITATION_ENDPOINTS.RESPOND, body);
            return res.data;
        },

        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: pendingKey });
            await queryClient.cancelQueries({ queryKey: notificationsKey });
            if (payload.status === "accepted") {
                await queryClient.cancelQueries({ queryKey: activeGroupKey });
            }

            const previousPending = queryClient.getQueryData<ApiResponse<IGroupTimer[]>>(pendingKey);
            const previousNotifications = queryClient.getQueryData<ApiResponse<IGetNotificationsData>>(notificationsKey);
            const previousActive = queryClient.getQueryData<ApiResponse<IGroupTimer[]>>(activeGroupKey);

            queryClient.setQueryData(pendingKey, (old?: ApiResponse<IGroupTimer[]>) =>
                old ? { ...old, data: old.data.filter((t) => t._id !== payload.groupTimerId) } : old
            );

            queryClient.setQueryData(notificationsKey, (old?: ApiResponse<IGetNotificationsData>) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        notifications: old.data.notifications.filter(
                            (n) => n.invitation?.groupTimerId !== payload.groupTimerId
                        ),
                    },
                };
            });

            if (payload.status === "accepted" && payload.timer) {
                queryClient.setQueryData(activeGroupKey, (old?: ApiResponse<IGroupTimer[]>) => {
                    const alreadyThere = old?.data.some((t) => t._id === payload.groupTimerId);
                    if (alreadyThere) return old;

                    const optimisticTimer: IGroupTimer = {
                        ...payload.timer!,
                        invitedUsersId: (payload.timer!.invitedUsersId ?? []).filter((id) => id !== userId),
                        participants: [
                            ...(payload.timer!.participants ?? []),
                            {
                                user: { _id: userId, username: "You", avatar: "", isOnline: true },
                                productivityDone: 0, isCurrentlyActive: false,
                                rank: (payload.timer!.participants?.length ?? 0) + 1,
                                hasCompleted: false, archived: false,
                            },
                        ],
                    };

                    return {
                        ...(old ?? { statusCode: 200, success: true, message: "", data: [] }),
                        data: [optimisticTimer, ...(old?.data ?? [])],
                    };
                });
            }

            return { previousPending, previousNotifications, previousActive };
        },

        onError: (error: Error | AxiosError, payload, context) => {
            if (context?.previousPending) queryClient.setQueryData(pendingKey, context.previousPending);
            if (context?.previousNotifications) queryClient.setQueryData(notificationsKey, context.previousNotifications);
            if (payload.status === "accepted" && context?.previousActive) {
                queryClient.setQueryData(activeGroupKey, context.previousActive);
            }

            const axiosErr = error as AxiosError;
            let message = "Invitation response failed to be sent !";
            if (axiosErr.isAxiosError && axiosErr.response) {
                const responseData = axiosErr.response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },

        onSuccess: (_data, variables) => {
            toast.success(variables.status === "accepted" ? "Invitation accepted !" : "Invitation declined !");
        },

        onSettled: async (_data, _err, payload) => {
            await queryClient.invalidateQueries({ queryKey: pendingKey });
            await queryClient.invalidateQueries({ queryKey: notificationsKey });
            if (payload.status === "accepted") {
                await queryClient.invalidateQueries({ queryKey: activeGroupKey });
            }
        },
    });
};

export default useRespondToInvitationMutation;