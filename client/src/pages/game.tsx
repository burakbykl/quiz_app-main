import { useState, useMemo } from "react";
// import { useParams } from "react-router-dom"; // Import useParams
import Map from "../map/map";
import io, { Socket } from "socket.io-client";

function Game() {
  //   const { roomcode } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useMemo(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connection established in GamePlay.");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket connection lost in GamePlay.");
    });

    newSocket.on("playerInfo", (info) => {
      setPlayerInfo(info);
    });

    newSocket.on("gameStart", () => {
      setGameStarted(true);
      console.log("Game started");
    });

    return () => newSocket.close();
  }, []);

  if (!playerInfo) {
    return <div>Giriş yapılıyor...</div>;
  }

  return (
    <div className="container">
      {gameStarted && playerInfo && socket && (
        <Map socket={socket} playerInfo={playerInfo} />
      )}
    </div>
  );
}

export default Game;
