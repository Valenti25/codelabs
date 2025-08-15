'use client'

import { ChatDTO, RoomChatDTO } from "@/services/chatRoom.service";
import { io, Socket } from "socket.io-client";


type TPayloadUserLogin = {
    userData: {
        _id: string;
        accessToken: string;
    }
}

interface ServerToClientEvents {
    newRoomChat: (payload: RoomChatDTO) => void;
    sendMessage: (payload: ChatDTO) => void;
}

interface ClientToServerEvents {
    userLogin: (payload: TPayloadUserLogin) => void;
}

const URL = process.env.NEXT_PUBLIC_SOCKET_URL as string
export const socket = (accessToken: string) => {
    const query: { [key: string]: string } = {
        query: `authorization=Bearer ${accessToken}`
    }

    const socketClient: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, query);
    return socketClient
}