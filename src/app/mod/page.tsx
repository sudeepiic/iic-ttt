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

    (window as any).moderatorSocket.on("ALL-MEMBERS", (onlineMembers) => {
      setMembers(onlineMembers);
    });
    (window as any).moderatorSocket.on("ALL_ROOMS", (onlineMembers) => {
      setcurrentRoom(onlineMembers);
    });
  }, []);

  const startTournament = () => {
    if (members.length % 2 === 0) {
      (window as any).moderatorSocket.emit("START-TOURNAMENT");
      // alert("Tournament started!");
      // Add your tournament logic here
    }
  };

  return (
    <div>
      <h1>Online Members</h1>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member.name}</li>
        ))}
      </ul>
      <button onClick={startTournament} disabled={members.length % 2 !== 0}>
        Start Tournament
      </button>

      <div className="counts">
        {
          // maxRooms.forEach(count => {

          // })

          currentRoom.map((room: any, index) => {
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
          })
        }
      </div>
    </div>
  );
}
