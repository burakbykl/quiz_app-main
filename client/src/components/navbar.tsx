import { AppBar, Toolbar, Button, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UseUserAuth } from "../context/UserAuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = UseUserAuth();

  const handleLogout = () => {
    try {
      logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="body2" sx={{ flex: 1 }}>
          Quizzing
        </Typography>
        {user && (
          <>
            <Button color="inherit" onClick={() => navigate("/join-room")}>
              Join Room
            </Button>
            <Button color="inherit" onClick={() => navigate("/create-room")}>
              Create Room
            </Button>
            <IconButton color="inherit" onClick={handleLogout}>
              Logout
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
