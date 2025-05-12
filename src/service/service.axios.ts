import axios from "axios";
import { token } from "./token";
export const baseURL = import.meta.env.VITE_BACKEND_URI;
export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    authorization: `Bearer ${token}`,
    "Content-type": "application/json",
  },
});
