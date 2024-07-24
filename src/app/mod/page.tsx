"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function DB() {
  const socket = io("http://192.168.111.116:3000/", {
    query: {
      name: "syd",
      role: "moderator",
    },
    transports: ["websocket"],
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket.on("updateMembers", (onlineMembers) => {
      setMembers(onlineMembers);
    });

    return () => {
      socket.off("updateMembers");
    };
  }, [socket]);

  const startTournament = () => {
    if (members.length % 2 === 0) {
      socket.emit("START-TOURNAMENT");
      alert("Tournament started!");
      // Add your tournament logic here
    }
  };

  return (
    <div>
      <h1>Online Members</h1>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
      <button onClick={startTournament} disabled={members.length % 2 !== 0}>
        Start Tournament
      </button>
    </div>
  );
}
