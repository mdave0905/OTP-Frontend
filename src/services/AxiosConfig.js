// src/services/axiosConfig.js
import axios from "axios";
import { getToken } from "./AuthService";
import { BACKEND_URL } from "../config";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add the ngrok-skip-browser-warning header
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

export default apiClient;
