import { apiAuth } from "../config/apiConfig";
import { storeTokens, clearTokens } from "../config/apiConfig";
import Cookies from "js-cookie";
import authSlice, { login, setUser } from "../store/authSlice.ts";
import { Dispatch } from "@reduxjs/toolkit";
import { User } from "../store/authSlice.ts";

// Types
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data: { data } } = await apiAuth.post(
      "/login",
      { email, password },
    );
    console.log("Login response:", data.accessToken);
    storeTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout(dispatch: Dispatch): Promise<void> {
    try {
      await apiAuth.post("/logout");
    } catch (error: any) {
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

  async signup(email: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const { data } = await apiAuth.post("/register", formData);
    storeTokens(data.access_token, data.refresh_token);
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { data } } = await apiAuth.get("/me");
      return data;
    } catch {
      return null;
    }
  },
};

export const loginUser = async (
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<User> => {
  const data = await authService.login(email, password);
  const user = await authService.getCurrentUser();
  if (!user) throw new Error("Failed to fetch user data after login");
  dispatch(login({ token: data.accessToken, user }));
  return user;
};

export const signupUser = async (
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<{ user: User }> => {
  const data = await authService.signup(email, password);
  const user = await authService.getCurrentUser();
  if (!user) throw new Error("Failed to fetch user data after signup");
  dispatch(login({ token: data.accessToken, user }));
  return { user };
};

export const logoutUser = async (dispatch: Dispatch): Promise<void> => {
  await authService.logout(dispatch);
};

export const checkUserSession = async (
  dispatch: Dispatch
): Promise<User | null> => {
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

const withErrorHandling =
  <T extends (...args: any[]) => Promise<any>>(fn: T) =>
  async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      throw new Error(error.message || `${fn.name} failed. Please try again.`);
    }
  };

export default {
  loginUser: withErrorHandling(loginUser),
  signupUser: withErrorHandling(signupUser),
  logoutUser: withErrorHandling(logoutUser),
  checkUserSession: withErrorHandling(checkUserSession),
};