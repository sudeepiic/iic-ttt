import { io } from "socket.io-client";

const createSocket = (playerData: any) => {
  const socket = io("http://192.168.111.116:3000/", {
    query: {
      name: playerData.name,
      role: playerData.role,
    },
    transports: ["websocket"],
  });
  return socket;
};
const moderatorSocket = () => {
  const socket = io("http://192.168.111.116:3000/", {
    query: {
      name: "syd",
      role: "moderator",
    },
    transports: ["websocket"],
  });
  return socket;
};
export { createSocket, moderatorSocket };
