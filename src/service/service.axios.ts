import axios from "axios";
import { token } from "./token";
export const baseURL = "https://api-chatting-app.onrender.com";
export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    authorization: `Bearer ${token}`,
    "Content-type": "application/json",
  },
});
