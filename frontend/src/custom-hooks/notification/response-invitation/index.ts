import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/Axios-client";
import { toast } from "sonner";
import type { InvitationStatus, IGetNotificationsData } from "@/types/notification";
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

const notificationQueryPredicate = (userId: string) => (query: { queryKey: readonly unknown[] }) =>
    query.queryKey[0] === "notifications" && query.queryKey[1] === "list" && query.queryKey[2] === userId;

const useRespondToInvitationMutation = (userId: string) => {
    const queryClient = useQueryClient();
    const pendingKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.PENDING_INVITES(userId);
    const activeGroupKey = QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId);

    return useMutation({
        mutationFn: async (payload: IRespondPayload) => {
            const { timer, ...body } = payload;
            const res = await axiosClient.post(ENDPOINTS.GROUP_TIMER_INVITATION_ENDPOINTS.RESPOND, body);
            return res.data;
        },

        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: pendingKey });
            await queryClient.cancelQueries({ predicate: notificationQueryPredicate(userId) });
            if (payload.status === "accepted") await queryClient.cancelQueries({ queryKey: activeGroupKey });

            const previousPending = queryClient.getQueryData<ApiResponse<IGroupTimer[]>>(pendingKey);
            const previousActive = queryClient.getQueryData<ApiResponse<IGroupTimer[]>>(activeGroupKey);
            const previousNotificationEntries = queryClient.getQueriesData<ApiResponse<IGetNotificationsData>>({
                predicate: notificationQueryPredicate(userId),
            });

            queryClient.setQueryData(pendingKey, (old?: ApiResponse<IGroupTimer[]>) =>
                old ? { ...old, data: old.data.filter((t) => t._id !== payload.groupTimerId) } : old
            );

            queryClient.setQueriesData<ApiResponse<IGetNotificationsData>>(
                { predicate: notificationQueryPredicate(userId) },
                (old) => {
                    if (!old) return old;
                    const removedCount = old.data.notifications.filter(
                        (n) => n.invitation?.groupTimerId === payload.groupTimerId
                    ).length;
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            notifications: old.data.notifications.filter((n) => n.invitation?.groupTimerId !== payload.groupTimerId),
                            unreadCount: Math.max(0, old.data.unreadCount - removedCount),
                        },
                    };
                }
            );

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
                                username: "You",
                                user: { _id: userId, username: "You", avatar: "", isOnline: true, provider: "", email: "" },
                                productivityDone: 0,
                                isCurrentlyActive: false,
                                rank: (payload.timer!.participants?.length ?? 0) + 1,
                                hasCompleted: false,
                                archived: false,
                            },
                        ],
                    };
                    return { ...(old ?? { statusCode: 200, success: true, message: "", data: [] }), data: [optimisticTimer, ...(old?.data ?? [])] };
                });
            }

            return { previousPending, previousActive, previousNotificationEntries };
        },

        onError: (error: Error | AxiosError, payload, context) => {
            if (context?.previousPending) queryClient.setQueryData(pendingKey, context.previousPending);
            if (payload.status === "accepted" && context?.previousActive) queryClient.setQueryData(activeGroupKey, context.previousActive);
            context?.previousNotificationEntries?.forEach(([key, data]) => queryClient.setQueryData(key, data));

            const axiosErr = error as AxiosError;
            const message = (axiosErr.isAxiosError && (axiosErr.response?.data as any)?.message) || "Invitation response failed to be sent !";
            toast.error(message);
        },

        onSuccess: (_data, variables) => {
            toast.success(variables.status === "accepted" ? "Invitation accepted !" : "Invitation declined !");
        },

        onSettled: async (_data, _err, payload) => {
            await queryClient.invalidateQueries({ predicate: notificationQueryPredicate(userId) });
            await queryClient.invalidateQueries({ queryKey: pendingKey });
            if (payload.status === "accepted") await queryClient.invalidateQueries({ queryKey: activeGroupKey });
        },
    });
};

export default useRespondToInvitationMutation;