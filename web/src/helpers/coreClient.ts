import axios from "axios";

// Core Client
export const coreClient = axios.create({
  baseURL: "https://hackyeah-2024.onrender.com",
  withCredentials: true
})
