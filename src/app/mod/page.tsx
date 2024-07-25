"use client";
// @ts-ignore
import { moderatorSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function DB() {
  const [members, setMembers] = useState([]);
  const [currentRoom, setcurrentRoom] = useState([]);
  useEffect(() => {
    (window as any).moderatorSocket = moderatorSocket();

    (window as any).moderatorSocket.on("ALL-MEMBERS", (onlineMembers: any) => {
      setMembers(onlineMembers);
    });
    (window as any).moderatorSocket.on("ALL_ROOMS", (onlineMembers: any) => {
      setcurrentRoom(onlineMembers);
    });
  }, []);

  const startTournament = () => {
    if (members.length % 2 === 0) {
      (window as any).moderatorSocket.emit("START-TOURNAMENT");
    }
  };

  return (
    <div>
      <h1>Online Members</h1>
      <ul>
        {members.map((member: any, index: number) => (
          <li key={index}>{member.name}</li>
        ))}
      </ul>
      <button onClick={startTournament} disabled={members.length % 2 !== 0}>
        Start Tournament
      </button>

      {currentRoom.length && (
        <div className="counts">
          <h1 className="mb-5">
            Players playing in this tournament and their pairings
          </h1>
          {currentRoom.map((room: any, index) => {
            return (
              <>
                <div className={`room-${room.count} inline room`}>
                  {room.player1.name + " VS " + room.player2.name + "       "}
                </div>

                {index != 0 && room.count != currentRoom[index - 1] && (
                  <div className="seperator"> </div>
                )}
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
