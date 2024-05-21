import { useState, useEffect } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function JoinRoom() {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [joinStatus, setJoinStatus] = useState<"failed" | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false); // Check socket connection status
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:3001");

    // Listen for socket connection status changes
    socket.on("connect", () => {
      console.log("Socket connection established in JoinRoom.");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket connection lost in JoinRoom.");
      setIsSocketConnected(false);
    });

    return () => {
      // Clean up event listeners and disconnect socket when component unmounts
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  const socket = io("http://localhost:3001"); // Create socket connection here

  const joinRoom = () => {
    if (!code || !username) {
      console.error("Room code and username are required.");
      return;
    }
    console.log(`Emitting 'joinRoom' event with room code: ${code}`);
    socket.emit("joinRoom", code, username); // Use the existing socket instance
  };

  useEffect(() => {
    socket.on("joinRoomResponse", (response) => {
      console.log(
        `Received 'joinRoomResponse' event with response: ${response}`
      );
      if (response === "joined") {
        navigate(`/quiz/${code}`);
      } else if (response === "failed") {
        setJoinStatus("failed");
      }
    });

    return () => {
      // Clean up event listeners (not disconnecting the socket) when component unmounts
      socket.off("joinRoomResponse");
    };
  }, [navigate, code, socket]);

  return (
    <div>
      <Typography variant="h4">Join a Game</Typography>
      <Box mt={2}>
        <TextField
          label="Room Code"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
        />
      </Box>
      <Box mt={2}>
        <TextField
          label="Your Name"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={joinRoom}
        disabled={!code || !username || !isSocketConnected}
        fullWidth
        style={{ marginTop: "20px" }}
      >
        Join Game
      </Button>
      {joinStatus === "failed" && (
        <Typography variant="body2" color="error" mt={2}>
          Joining the room failed. Please check the room code and try again.
        </Typography>
      )}
    </div>
  );
}

export default JoinRoom;
