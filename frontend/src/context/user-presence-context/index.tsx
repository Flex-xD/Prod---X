import { useSocketEvent } from "@/custom-hooks/socket/listen-event";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface IPresenceContext {
    isUserOnline: (userId: string) => boolean;
    seedOnlineUsers: (userIds: string[]) => void;
}

const PresenceContext = createContext<IPresenceContext>({
    isUserOnline: () => false,
    seedOnlineUsers: () => {},
});

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
    const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());

    const seedOnlineUsers = useCallback((userIds: string[]) => {
        setOnlineIds((prev) => new Set([...prev, ...userIds]));
    }, []);

    useSocketEvent<{ userId: string; isOnline: boolean }>(
        "user.status.changed",
        useCallback(({ userId, isOnline }) => {
            setOnlineIds((prev) => {
                const next = new Set(prev);
                isOnline ? next.add(userId) : next.delete(userId);
                return next;
            });
        }, [])
    );

    const isUserOnline = useCallback((userId: string) => onlineIds.has(userId), [onlineIds]);

    return (
        <PresenceContext.Provider value={{ isUserOnline, seedOnlineUsers }}>
            {children}
        </PresenceContext.Provider>
    );
};

export const usePresence = () => useContext(PresenceContext);