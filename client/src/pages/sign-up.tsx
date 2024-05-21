import { useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CustomButton from "../components/customButton";
import { Link, useNavigate } from "react-router-dom";
import { UseUserAuth } from "../context/UserAuthContext";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = UseUserAuth();
  const navigate = useNavigate();

  const handleSignup = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      signUp(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 300,
          padding: 2.5,
          borderRadius: "10px",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "500" }}>
            SIGN UP
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email Id"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { fontSize: "15px" } }}
            InputLabelProps={{ style: { fontSize: "15px" } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{ style: { fontSize: "15px" } }}
            InputLabelProps={{ style: { fontSize: "15px" } }}
          />
        </CardContent>
        <CardActions>
          <CustomButton text={"Sign Up"} handleClick={handleSignup} />
        </CardActions>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption">
            Already have an account? <Link to="/login">Log In</Link>
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
}

export default SignUpPage;
