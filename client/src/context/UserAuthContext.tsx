import { useContext, useState, useEffect, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "../conf/firebase";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import ProtectedRoute from "../conf/protectedRoute";

type UserAuthContextType = {
  user: User | null | undefined;
  logIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
  logOut: () => void;
  googleSignIn: () => void;
};

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  logIn: () => {},
  signUp: () => {},
  logOut: () => {},
  googleSignIn: () => {},
});

export function UserAuthContextProvider() {
  const [user, setUser] = useState<User | null>();

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = { user, logIn, signUp, logOut, googleSignIn };

  return (
    <UserAuthContext.Provider value={value}>
      <Navbar />
      <ProtectedRoute children={<Outlet />} />
    </UserAuthContext.Provider>
  );
}

export function UseUserAuth() {
  return useContext(UserAuthContext);
}
