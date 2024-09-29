import axios from "axios";

export const coreClient = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
})
