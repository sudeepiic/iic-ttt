import { io } from "socket.io-client";

export const createSocket = (playerData: any) => {
  const socket = io("http://192.168.111.116:3000/", {
    query: {
      name: playerData.name,
      role: playerData.role,
    },
    transports: ["websocket"],
  });
  return socket;
};
