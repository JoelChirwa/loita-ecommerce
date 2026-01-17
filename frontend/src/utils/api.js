import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add a request interceptor to include token if available
API.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("loita-auth-storage");
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    const token = state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
