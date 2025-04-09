// src/config/apiConfig.js
const SERVER_URL = "https://demoserver.zeabur.app/api/";

export const COOKIE_CONFIG = {
  sameSite: "Lax",
  path: "/",
};

export const AXIOS_CONFIG = {
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};
