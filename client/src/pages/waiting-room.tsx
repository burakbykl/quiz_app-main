import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function WaitingRoom() {
  const { code } = useParams();
  const [users, setUsers] = useState<
    {
      userId: string;
      username: string;
    }[]
  >([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const navigate = useNavigate();

  const socket = io("http://localhost:3001");

  useMemo(() => {
    socket.on("connect", () => {
      console.log("Socket connection established in WaitingRoom.");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket connection lost in WaitingRoom.");
      setIsSocketConnected(false);
    });

    socket.on("userJoined", (user) => {
      console.log("Received 'userJoined' event:", user);

      // Update the users list with the new user
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("userLeft", (user) => {
      console.log("Received 'userLeft' event:", user);

      // Remove the user from the users list
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.userId !== user.userId)
      );
    });

    // Listen for the "gameStarted" event
    socket.on("gameStarted", () => {
      console.log("Received confirmation");
      setGameStarted(true);
      console.log("Game started");
      navigate(`/game/${code}`);
    });

    // Add error handling for socket.io events
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("connect_timeout", (timeout) => {
      console.error("Socket connection timeout:", timeout);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("gameStarted");
    };
  }, [navigate, code, socket]);

  const startGame = () => {
    console.log("Attempting to start game...");
    socket.emit("startGame", code);
    console.log("Sent request");
  };

  const isCreator = new URLSearchParams(window.location.search).get("creator");

  return (
    <div>
      <Typography variant="h4">Waiting Room</Typography>
      <Typography variant="h6">Room Code: {code}</Typography>
      <Typography variant="h6">Users in this room:</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.userId}>
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
      {isCreator === "true" && !gameStarted ? (
        <Button
          variant="contained"
          color="primary"
          onClick={startGame}
          fullWidth
          style={{ marginTop: "20px" }}
          disabled={!isSocketConnected}
        >
          Start Game
        </Button>
      ) : gameStarted ? (
        <Typography variant="h6">Game has started</Typography>
      ) : (
        <Typography variant="h6">
          Waiting for the creator to start the game
        </Typography>
      )}
    </div>
  );
}

export default WaitingRoom;
