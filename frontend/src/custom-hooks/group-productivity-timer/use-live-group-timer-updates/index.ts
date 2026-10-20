import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/lib/socket.io";
import { userAppStore } from "@/store";
import { QUERY_KEYS } from "@/constants/query-keys";

interface IGroupTimerUpdatedPayload {
    groupTimerId: string;
    recipients: string[];
}

export const useLiveGroupTimerUpdates = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";

    useEffect(() => {
        const handler = (payload: IGroupTimerUpdatedPayload) => {
            if (payload.recipients.includes(userId)) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.ACTIVE_GROUP_TIMERS(userId) });
                // * Someone answered an invitation: refresh *my* pending invites too
                // * (so an accepted/declined timer disappears from this list live).
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_PRODUCTIVITY_TIMER.PENDING_INVITES(userId) });
                // * Keep the dashboard's group-timer snapshot/progress fresh as well.
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY(userId) });
            }
        };
        socket.on("group.timer.participant.updated", handler);
        return () => {
            socket.off("group.timer.participant.updated", handler);
        };
    }, [userId, queryClient]);
};