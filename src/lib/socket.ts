import { io } from "socket.io-client";

const createSocket = (playerData: any) => {
  const socket = io("https://iic-ttt-backend.onrender.com/", {
    query: {
      name: playerData.name,
      role: playerData.role,
    },
    transports: ["websocket"],
  });
  return socket;
};
const moderatorSocket = () => {
  const socket = io("https://iic-ttt-backend.onrender.com/", {
    query: {
      name: "syd",
      role: "moderator",
    },
    transports: ["websocket"],
  });
  return socket;
};
export { createSocket, moderatorSocket };
