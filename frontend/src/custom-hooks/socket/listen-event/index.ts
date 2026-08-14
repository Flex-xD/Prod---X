// src/hooks/useSocketEvent.ts
import socket from "@/lib/socket.io";
import { useEffect } from "react";

export function useSocketEvent<TPayload = unknown>(
    event: string,
    handler: (payload: TPayload) => void
) {
    useEffect(() => {
        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [event, handler]);
}