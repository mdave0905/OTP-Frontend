// src/components/PublicRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return children;
};

export default PublicRoute;
