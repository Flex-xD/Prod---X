import { io, Socket } from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_GATEWAY_URL || "http://localhost:11000";

const socket: Socket = io(socketURL, {
    autoConnect: false,
    withCredentials: true,
    auth: {}
});

export default socket;