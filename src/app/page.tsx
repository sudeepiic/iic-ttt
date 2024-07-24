"use client";
import Image from "next/image";
import { useState } from "react";
import { io } from "socket.io-client";

import { createSocket } from "@/lib/socket";
export default function Home() {
  const [gameState, setGameState] = useState<any>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [hasWon, setHasWon] = useState<any>(false);

  const [canMove, updateCanMove] = useState<any>(false);
  const [playerName, setplayerName] = useState<any>(false);
  (window as any).won = false;
  const [players, setPlayers] = useState<any>([
    {
      name: "syd",
      id: "ssda",
    },
    {
      name: "divya",
      id: "ssd2",
    },
  ]);
  const updateMove = (position: number, value: string, shouldEmit: boolean) => {
    console.log("current move type");
    if (shouldEmit) {
      (window as any).playerSocket.emit("PLAY", {
        position,
        roomId: players.id,
        player: (window as any).playerSocket.id,
      });
    }
    setGameState((prevItems: any) => {
      const newItems = [...prevItems];
      console.log(newItems);
      newItems[position] = value;
      let result = checkWhoWon(newItems);
      console.log("result", result);
      setHasWon(result);

      if (result || result == 0) {
        updateCanMove(false);
        console.log("sdsaweaweaweawe", (window as any).moveType);
        if (
          (result == (window as any).moveType ||
            result == (window as any).moveType) &&
          !(window as any).won
        ) {
          (window as any).won = true;
          (window as any).playerSocket.emit("PLAYER-WON", {
            room: players.id,
            playerId: (window as any).playerSocket.id,
          });
        }
      }

      return newItems;
    });
    updateCanMove(false);
  };

  const restart = () => {
    setGameState([]);
  };
  const checkWhoWon = (newItems: any) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        newItems[a] &&
        newItems[a] === newItems[b] &&
        newItems[a] === newItems[c]
      ) {
        return newItems[a];
      }
    }

    return null;
  };

  function sn() {
    (window as any).playerSocket = createSocket({
      name: playerName,
      role: "player",
    });
    (window as any).playerSocket.on("START-PLAY", (data: any) => {
      setPlayers(data);
      console.log("idsdsdsd", data.player1.id, (window as any).playerSocket.id);
      setGameState([null, null, null, null, null, null, null, null, null]);
      if (data.player1.id == (window as any).playerSocket.id) {
        (window as any).moveType = "x";
        updateCanMove(true);
      } else {
        (window as any).moveType = "0";
        updateCanMove(false);
      }
    });

    (window as any).playerSocket.on("PLAYER-PLAYED", (data: any) => {
      console.log("current player", (window as any).moveType);
      if (data.player != (window as any).playerSocket.id) {
        updateMove(
          data.position,
          (window as any).moveType === "x" ? "0" : "x",
          data.player == (window as any).playerSocket.id
        );
        console.log("oppp player mooved", (window as any).moveType);
        updateCanMove(true);
      }
    });
    console.log((window as any).playerSocket.id);
  }
  return (
    <main className=" min-h-screen flex-col items-center justify-between p-24">
      <p>please enter your name : </p>
      <input onChange={(e) => setplayerName(e.target.value)} type="text" />
      <button onClick={() => sn()}>Submit</button>
      {/* <p> Player 1 : {players.name}</p>
      Player 2 : {players.name} */}
      <p></p> <br />
      <div id="game-frame">
        {gameState.map((state: any, index: number) => {
          return (
            <div
              key={index}
              onClick={() => updateMove(index, (window as any).moveType, true)}
              className={`tickbox ${
                canMove ? "cursor-auto" : "pointer-events-none"
              }`}
            >
              {state == "x" && <>X</>}
              {state == "0" && <>0</>}
            </div>
          );
        })}
      </div>
      {(hasWon || hasWon == "0") && (
        <>
          {hasWon == (window as any).moveType
            ? "Congratulations you have won this match. please while we connect you to the next round..."
            : "Sorry, please try again"}
        </>
      )}
    </main>
  );
}
