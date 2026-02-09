import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

const axiosInstance = axios.create({
  baseURL: BACKEND,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

export default axiosInstance;
