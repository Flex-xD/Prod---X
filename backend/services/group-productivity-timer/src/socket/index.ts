import { Server } from "socket.io";
import { http } from "winston";
import { ApiError } from "../shared";
import { any } from "zod";
import { StatusCodes } from "http-status-codes";

let io:any;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    return io;
};

export const getSocket = () => {
    if(!io) {
        throw ApiError( StatusCodes.NOT_FOUND,"io not created yet !");
    }
    return io;
}