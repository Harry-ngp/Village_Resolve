import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Make sure your backend runs on this port
});

// Automatically add the user's token to every request
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("villageUser"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;