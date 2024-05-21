import React from "react";
import { UseUserAuth } from "../context/UserAuthContext";
import LoginPage from "../pages/login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = UseUserAuth();

  if (!user) {
    return <LoginPage />;
  }

  return children;
};

export default ProtectedRoute;
