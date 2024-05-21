import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import HomePage from "./pages/homepage";
import Game from "./pages/game";
import SignUpPage from "./pages/sign-up";
import WaitingRoom from "./pages/waiting-room";
import JoinRoom from "./pages/join-room";

function App() {
  return (
    <Routes>
      <Route path="/" Component={UserAuthContextProvider}>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:code" element={<Game />} />
        <Route path="/quiz/:code" element={<WaitingRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="*" element={<HomePage />} />
      </Route>
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
