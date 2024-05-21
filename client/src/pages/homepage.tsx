import { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UseUserAuth } from "../context/UserAuthContext";
import { io } from "socket.io-client";

function HomePage() {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { user } = UseUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Socket connection established.");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket connection lost.");
      setIsSocketConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  const createRoom = () => {
    const socket = io("http://localhost:3001");

    socket.emit("createRoom", (isCreator: boolean, room_code: number) => {
      if (isCreator) {
        navigate(`/quiz/${room_code}?creator=true`);
      } else {
        navigate(`/quiz/${room_code}`);
      }
    });

    socket.on("roomCreated", (room_code) => {
      console.log(`Received 'roomCreated' event with code: ${room_code}`);
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Hello, Welcome {user && user.email}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#e6f7ff" }}>
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                Create a Room
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={createRoom}
                disabled={!isSocketConnected}
              >
                Create Room
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#fff1e6" }}>
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                Join a Room
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate("/join-room")}
                disabled={!isSocketConnected}
              >
                Join
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomePage;
