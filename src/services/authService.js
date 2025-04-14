// src/services/authService.js
import { apiAuth } from "../config/apiConfig";
import { storeTokens, clearTokens } from "../config/apiConfig";
import Cookies from "js-cookie";
import { login, setUser } from "../store/authSlice";

// Auth Service
const authService = {

  async login(email, password) {
    const { data : {data} } = await apiAuth.post(
      "/login",
      { email, password },
    );
    console.log("Login response:", data.accessToken);
    storeTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout(dispatch) {
    try {
      await apiAuth.post("/logout");
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
    const { data } = await apiAuth.post("/register", formData);
    storeTokens(data.access_token, data.refresh_token);
    return data;
  },

  async getCurrentUser() {
    try {
      const { data : {data} } = await apiAuth.get("/me");
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
  dispatch(login({ token: data.accessToken, user }));
  return { user };
};

export const logoutUser = async (dispatch) => {
  await authService.logout(dispatch);
};

export const checkUserSession = async (dispatch) => {
  const token = Cookies.get("authToken");
  if (!token) {
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
