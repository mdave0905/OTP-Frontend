import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt";

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    // Check if the token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => !!getUserFromToken();

export const hasRole = (role) => {
  return getRoles().includes(role);
};

const getRoles = () => {
  const user = getUserFromToken();
  return user?.roles;
};
