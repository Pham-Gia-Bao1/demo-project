// src/services/authService.js
import axios from "axios";
import Cookies from "js-cookie";
import { login, setUser } from "../store/authSlice";

const SERVER_URL = "https://demoserver.zeabur.app/api/";

// API Instance
const api = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Enable sending cookies with requests
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Headers:", config.headers); // Debug: Log headers
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log(
      `Response from ${response.config.url}:`,
      response.status,
      response.data
    ); // Debug: Log response
    return response;
  },
  (error) => {
    console.error(
      `Error from ${error.config?.url}:`,
      error.response?.status,
      error.response?.data
    ); // Debug: Log error
    return Promise.reject(error);
  }
);

// Error handling helper
const handleError = (error, action) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || `${action} failed. Please try again.`;
    throw new Error(message);
  }
  throw new Error(`${action} failed. Please try again.`);
};

// Helper to store tokens
const storeTokens = (accessToken, refreshToken) => {
  // Set access token cookie (1 ngày)
  Cookies.set("authToken", accessToken, {
    expires: 1, // Hết hạn sau 1 ngày
    secure: false, // Để false cho localhost, true cho production (HTTPS)
    sameSite: "Lax",
    path: "/",
  });

  // Set refresh token cookie (có thể lâu hơn nếu cần)
  Cookies.set("refreshToken", refreshToken, {
    expires: 7, // Ví dụ: refresh token có thể sống 7 ngày
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
};

// Helper to clear tokens
const clearTokens = () => {};

// Auth API
const auth = {
  getCSRFToken: async () => {
    try {
      const { data } = await api.get("/csrf-token");
      return data.csrf_token;
    } catch (error) {
      throw handleError(error, "Fetching CSRF token");
    }
  },

  login: async (email, password) => {
    try {
      const csrfToken = await auth.getCSRFToken();
      const { data } = await api.post(
        "/login",
        { email, password },
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
        }
      );
      console.log("Login response:", data); // Debug response từ server
      storeTokens(data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      throw handleError(error, "Login");
    }
  },

  logout: async (dispatch) => {
    try {
      Cookies.remove("authToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      await api.post("/logout");
      clearTokens();
      dispatch(setUser(null));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn(
          "Token invalid or expired during logout. Proceeding with client-side cleanup."
        );
        clearTokens();
        dispatch(setUser(null));
        return;
      }
      throw handleError(error, "Logout");
    }
  },

  signup: async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const { data } = await axios.post(`${SERVER_URL}/register`, formData, {
        withCredentials: true,
      });
      storeTokens(data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      throw handleError(error, "Signup");
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await api.get("/me");
      return data;
    } catch (error) {
      return null;
    }
  },
};

// Export service functions
export const loginUser = async (email, password, dispatch) => {
  try {
    const data = await auth.login(email, password);
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new Error("Failed to fetch user data after signup.");
    }
    dispatch(login({ token: data.access_token, user }));
    return data.user;
  } catch (error) {
    throw new Error(
      error.message ||
        "Login failed. Please check your credentials and try again."
    );
  }
};

export const signupUser = async (email, password, dispatch) => {
  try {
    const data = await auth.signup(email, password);
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new Error("Failed to fetch user data after signup.");
    }
    dispatch(login({ token: data.access_token, user }));
    return { user };
  } catch (error) {
    throw new Error(error.message || "Signup failed. Please try again.");
  }
};

export const logoutUser = async (dispatch) => {
  try {
    await auth.logout(dispatch);
  } catch (error) {
    throw new Error(error.message || "Logout failed. Please try again.");
  }
};
export const checkUserSession = async (dispatch) => {
  try {
    const token = Cookies.get("authToken"); // Lấy token từ cookies
    if (!token) {
      console.log("No token found in cookies.");
      dispatch(setUser(null)); // Reset Redux nếu không có token
      return null;
    }

    const user = await auth.getCurrentUser(); // Gọi API để lấy thông tin user
    console.log(user, "akjdahskdahsdkahsdakdhak");
    if (user) {
      dispatch(login({ token, user })); // Dispatch action login với token và user
      console.log("Session restored with user:", user);
      return user;
    } else {
      console.log("No user data returned from server.");
      clearTokens();
      dispatch(setUser(null));
      return null;
    }
  } catch (error) {
    console.error("Auto-login check failed:", error.message);
    clearTokens();
    dispatch(setUser(null));
    return null;
  }
};
