import socket from "@/lib/socket.io";
import { userAppStore } from "@/store";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// ? create
// ? provide
// ? pass
// ? consume

interface ISocketConnection {
    isConnected: boolean
}

export const socketContext = createContext<ISocketConnection>({ isConnected: false });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const accessToken = userAppStore((state) => state.accessToken);

    useEffect(() => {
        if (isConnected) return;
        if (!accessToken) {
            socket.disconnect();
            return;
        }

        socket.auth = { token: accessToken };
        socket.connect();

        const handleConnect = () => { 
            setIsConnected(true);
            console.log(`Socket Connected : ${socket.id}`);
        };
        const handleDisconnect = () => {
            setIsConnected(false);
            console.log(`Socket is Disconnected : ${socket.id}`);
        };

        const handleConnectionError = (err: Error) => {
            console.log(`Error while socket connection : ${err.message}`);
        }

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectionError);

        () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectionError);
        };

    }, [accessToken])
    return (
        <socketContext.Provider value={{ isConnected }}>
            {children}
        </socketContext.Provider>
    )
}

export const useSocketStatus = () => useContext(socketContext);