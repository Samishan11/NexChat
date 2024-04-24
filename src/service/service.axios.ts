import axios from "axios";
import { token } from "./token";
export const baseURL = "https://chat-backend-api-qq83.onrender.com";
export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    authorization: `Bearer ${token}`,
    "Content-type": "application/json",
  },
});
