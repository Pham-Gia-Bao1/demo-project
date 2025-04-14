// src/config/apiConfig.js
import axios from "axios";
import Cookies from "js-cookie";

// Server URLs
const SERVER_URL_AUTH = "https://eeduupb2kj.execute-api.us-west-2.amazonaws.com/";
const SERVER_URL_TASK = "https://8ytwecozv8.execute-api.us-west-2.amazonaws.com/";

// Cookie config
export const COOKIE_CONFIG = {
  sameSite: "Lax",
  path: "/",
};

// Hàm khởi tạo axios instance có gắn interceptor tự động thêm token
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: false,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("authToken");
      console.log("Token:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
};

// Tạo các API instance
export const apiAuth = createAxiosInstance(SERVER_URL_AUTH);
export const apiTask = createAxiosInstance(SERVER_URL_TASK);

// Hàm xử lý token
export const storeTokens = (accessToken, refreshToken) => {
  Cookies.set("authToken", accessToken, { ...COOKIE_CONFIG, expires: 1 });
  Cookies.set("refreshToken", refreshToken, { ...COOKIE_CONFIG, expires: 7 });
};

export const clearTokens = () => {
  Cookies.remove("authToken", COOKIE_CONFIG);
  Cookies.remove("refreshToken", COOKIE_CONFIG);
};
