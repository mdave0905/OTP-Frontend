import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, checkRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.some((role) => checkRole(role))) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
