import axios from "axios";
import { token } from "./token";
export const apiClient = axios.create({
  baseURL: "https://api-chatting-app.onrender.com/api",
  headers: {
    authorization: `Bearer ${token}`,
    "Content-type": "application/json",
  },
});
