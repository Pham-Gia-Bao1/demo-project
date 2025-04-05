// src/services/authService.js
import axios from "axios";
import Cookies from "js-cookie";
import { login, setUser } from "../store/authSlice";

const SERVER_URL = "https://demoserver.zeabur.app/api/";
const COOKIE_CONFIG = {
  sameSite: "Lax",
  path: "/",
};

const api = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const handleError = (error, action) => {
  const message =
    error.response?.data?.message || `${action} failed. Please try again.`;
  throw new Error(message);
};

const storeTokens = (accessToken, refreshToken) => {
  Cookies.set("authToken", accessToken, { ...COOKIE_CONFIG, expires: 1 });
  Cookies.set("refreshToken", refreshToken, { ...COOKIE_CONFIG, expires: 7 });
};

const clearTokens = () => {
  Cookies.remove("authToken", COOKIE_CONFIG);
  Cookies.remove("refreshToken", COOKIE_CONFIG);
};

// Auth Service
const authService = {
  async getCSRFToken() {
    const { data } = await api.get("/csrf-token");
    return data.csrf_token;
  },

  async login(email, password) {
    const csrfToken = await this.getCSRFToken();
    const { data } = await api.post(
      "/login",
      { email, password },
      {
        headers: { "X-CSRF-TOKEN": csrfToken },
      }
    );
    storeTokens(data.access_token, data.refresh_token);
    return data;
  },

  async logout(dispatch) {
    try {
      await api.post("/logout");
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Token invalid or expired during logout.");
      } else {
        throw error;
      }
    } finally {
      clearTokens();
      dispatch(setUser(null));
    }
  },

  async signup(email, password) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const { data } = await api.post("/register", formData);
    storeTokens(data.access_token, data.refresh_token);
    return data;
  },

  async getCurrentUser() {
    try {
      const { data } = await api.get("/me");
      return data;
    } catch {
      return null;
    }
  },
};

// Exported Functions
export const loginUser = async (email, password, dispatch) => {
  const data = await authService.login(email, password);
  const user = await authService.getCurrentUser();
  if (!user) throw new Error("Failed to fetch user data after login");
  dispatch(login({ token: data.access_token, user }));
  return user;
};

export const signupUser = async (email, password, dispatch) => {
  const data = await authService.signup(email, password);
  const user = await authService.getCurrentUser();
  if (!user) throw new Error("Failed to fetch user data after signup");
  dispatch(login({ token: data.access_token, user }));
  return { user };
};

export const logoutUser = async (dispatch) => {
  await authService.logout(dispatch);
};

export const checkUserSession = async (dispatch) => {
  const token = Cookies.get("authToken");
  if (!token) {
    dispatch(setUser(null));
    return null;
  }

  const user = await authService.getCurrentUser();
  if (user) {
    dispatch(login({ token, user }));
    return user;
  }

  clearTokens();
  dispatch(setUser(null));
  return null;
};

// Error Handling Wrapper
const withErrorHandling =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw new Error(error.message || `${fn.name} failed. Please try again.`);
    }
  };

export default {
  loginUser: withErrorHandling(loginUser),
  signupUser: withErrorHandling(signupUser),
  logoutUser: withErrorHandling(logoutUser),
  checkUserSession: withErrorHandling(checkUserSession),
};
