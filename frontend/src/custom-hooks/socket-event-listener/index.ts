import socket from "@/lib/socket.io";
import { useEffect } from "react";

const useSocketEventListener = <T>(event:string , handler:(payload:T) => void) => {
    useEffect(() => {
        socket.on(event , handler);
    } , [event ,handler]);

    () => {
        socket.off(event , handler);
    }
};

export default useSocketEventListener;