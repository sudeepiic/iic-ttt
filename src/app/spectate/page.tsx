"use client";
// @ts-ignore
import { moderatorSocket } from "@/lib/socket";
import { useEffect, useState } from "react";

function Spectate() {
  useEffect(() => {
    (window as any).moderatorSocket = moderatorSocket();

    (window as any).moderatorSocket.on("ALL_ROOMS", (rooms: any) => {
      setallRooms(rooms);
    });
  }, []);

  const [allRooms, setallRooms] = useState([]);

  return (
    <div className=" mt-[4rem] ">
      <h2 className="text-center mb-5 text-2xl font-bold underline uppercase">
        Spectate any match you want
      </h2>
      <div className="flex flex-wrap mx-auto justify-center">
        {allRooms.map((room: any, index) => {
          return (
            <div key={room.id} className="mt-2 w-[400px] mb-4">
              <p className="mb-2 text-center">
                {" "}
                Players - {room.player1.name} vs {room.player2.name} <br />
                Current Round - {room.count}
                {room.winner && (
                  <>
                    {room.winner == room.player1.id && (
                      <p>
                        <span className="capitalize">{room.player1.name} </span>
                        has won this match
                      </p>
                    )}
                    {room.winner == room.player2.id && (
                      <p>
                        {" "}
                        <span className="capitalize">{room.player2.name} </span>
                        has won this match
                      </p>
                    )}
                  </>
                )}
                {!room.winner && <p> Players are currently playing</p>}
              </p>
              <div
                id="game-frame2"
                className="flex flex-wrap w-[300px] mx-auto"
              >
                {room.board.map((state: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="tickboxSpec pointer-events-none"
                    >
                      {state == "x" && <>X</>}
                      {state == "0" && <>0</>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {allRooms.length == 0 && <>Nobody is playing currently</>}
      </div>
    </div>
  );
}

export default Spectate;
