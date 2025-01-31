import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserFromToken,
  saveToken,
  removeToken,
  hasRole,
  isAuthenticated,
} from "./AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const login = (token) => {
    saveToken(token);
    setUser(getUserFromToken());
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const checkRole = (role) => {
    return hasRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: isAuthenticated(),
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
