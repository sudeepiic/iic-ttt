"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [startGame, setstartGame] = useState<any>(false);
  const [wonTournament, setWonTournament] = useState<any>(false);
  const [playerNameSubmitted, setplayerNameSubmitted] = useState<any>(false);
  const [canMove, updateCanMove] = useState<any>(false);
  const [playerName, setplayerName] = useState<any>(false);

  const waitingRoomGifs = [
    "https://i.giphy.com/l4FGlYoiqQTxBsyGY.webp",
    "https://i.giphy.com/daOkKrzlWaKXtZxxwW.webp",
    "https://i.giphy.com/yx400dIdkwWdsCgWYp.webp",
    "https://i.giphy.com/3o6gb3kkXfLvdKEZs4.webp",
    "https://i.giphy.com/gyCS97pRQhJAvBEX3D.webp",
    "https://i.giphy.com/zOwzTlnOnx1T9JZgql.webp",
    "https://i.giphy.com/VGcRGgJPFLS7QBJz4X.webp",
    "https://i.giphy.com/X8M3OBHBLRWDWVaLYd.webp",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzVxMDdlNDExZ3F5aTMyYzd2YWNiYjdxMDYyMGxkYTgyajg4cjVmOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GeimqsH0TLDt4tScGw/giphy.webp",
    "https://media0.giphy.com/media/OSfaAz9wRDBGZ28P0Z/200.webp?cid=ecf05e471t2kyj8oeyt9stjwkdarxuq6zbseysj7ckmfotr9&ep=v1_gifs_search&rid=200.webp&ct=g",
    "https://media2.giphy.com/media/ez2l9l9HZEOgQ9mjTi/giphy.webp?cid=790b76113ynpdan7h4ct75bveyqqve6xn051zvf6z25zdhlt&ep=v1_gifs_search&rid=giphy.webp&ct=g",
  ];

  const winnerGifs = [
    "https://i.giphy.com/4QFAH0qZ0LQnIwVYKT.webp",
    "https://i.giphy.com/MFmHhd0LenGBsqp7Uh.webp",
    "https://i.giphy.com/xT0GqssRweIhlz209i.webp",
    "https://i.giphy.com/MSmj1MrnT8q26dsuAi.webp",
    "https://i.giphy.com/lnlAifQdenMxW.webp",
    "https://i.giphy.com/gd0Dqg6rYhttBVCZqd.webp",
    "https://i.giphy.com/o75ajIFH0QnQC3nCeD.webp",
    "https://i.giphy.com/13w0EvKKrzNPH2.webp",
    "https://i.giphy.com/l4FGztRST7RVKUhoI.webp",
    "https://i.giphy.com/cQNRp4QA8z7B6.webp",
  ];
  useEffect(() => {
    (window as any).won = false;
  }, []);

  const [players, setPlayers] = useState<any>([
    {
      name: "syd",
      id: "playerID",
    },
    {
      name: "divya",
      id: "playerID",
    },
  ]);
  const updateMove = (position: number, value: string, shouldEmit: boolean) => {
    console.log("current move type");
    if (!gameState[position]) {
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
      if (shouldEmit) {
        let emitBoard = gameState;

        emitBoard[position] = value;

        (window as any).playerSocket.emit("PLAY", {
          position,
          roomId: players.id,
          player: (window as any).playerSocket.id,
          board: emitBoard,
        });
        console.log("game state", gameState);
      }
    }
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
    setplayerNameSubmitted(true);
    (window as any).playerSocket.on("START-PLAY", (data: any) => {
      setPlayers(data);
      setstartGame(true);
      (window as any).roomId = data.id;
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
    (window as any).playerSocket.on("YOU-WON-THIS-ROUND", (data: any) => {
      setHasWon((window as any).moveType);
      console.log("plaererere", (window as any).roomId);
      (window as any).playerSocket.emit("PLAYER-WON", {
        room: (window as any).roomId,
        playerId: (window as any).playerSocket.id,
      });
    });
    (window as any).playerSocket.on("YOU-WON", (data: any) => {
      setWonTournament(true);
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
      <div
        className={`text-center ${
          startGame || playerNameSubmitted ? "none" : "block"
        }`}
      >
        <p>Enter your name to start </p> <br />
        <input onChange={(e) => setplayerName(e.target.value)} type="text" />
        <button onClick={() => sn()}>Submit</button>
      </div>
      {playerNameSubmitted && !startGame && (
        <>
          <p className="my-4 text-center">
            {" "}
            Thanks for joining {playerName}, please wait while others gather and
            we start the tournament!
          </p>
          <img
            className="mx-auto"
            src={
              waitingRoomGifs[
                Math.floor(Math.random() * waitingRoomGifs.length)
              ]
            }
            alt=""
          />
        </>
      )}
      <p></p> <br />
      <p
        className={`text-center mb-5 ${
          startGame && !hasWon ? "block" : "none"
        }`}
      >
        {" "}
        Let the game begin!
      </p>
      {(hasWon || hasWon === "0") && (
        <p className="text-center">
          {!wonTournament && (
            <>
              {hasWon == (window as any).moveType ? (
                <>
                  <p>
                    {" "}
                    Congratulations you have won this match. please while we
                    connect you to the next round...{" "}
                  </p>
                  <img
                    className="mx-auto"
                    src={
                      winnerGifs[Math.floor(Math.random() * winnerGifs.length)]
                    }
                    alt="won game"
                  />
                </>
              ) : (
                <>
                  <p className="mb-4 mt-2">
                    {" "}
                    You lost this round, better luck next time!
                  </p>
                  <img
                    src="/lostgame.gif"
                    alt="lost game"
                    className="mx-auto"
                  />
                </>
              )}
            </>
          )}
          {wonTournament && (
            <span className="text-2xl text-green-400">
              🥇🥇🥇 YOU HAVE WON THIS TOURNAMENT 🥇🥇🥇
            </span>
          )}
        </p>
      )}
      <div id="game-frame" className={startGame ? "block" : "none"}>
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
    </main>
  );
}
