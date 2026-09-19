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
            }
        };
        socket.on("group.timer.participant.updated", handler);
        return () => {
            socket.off("group.timer.participant.updated", handler);
        };
    }, [userId, queryClient]);
};