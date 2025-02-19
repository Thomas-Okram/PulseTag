import { create } from "zustand";
import axios from "axios";

// API Base URL based on environment
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:7000/api/auth"
    : "https://pulsetagapp.com/api/auth";

// Configure Axios to include credentials (cookies)
axios.defaults.withCredentials = true;

// Helper to persist token in localStorage
const persistToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Restore token from localStorage on page reload
const storedToken = localStorage.getItem("authToken");
if (storedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!storedToken,
  isCheckingAuth: true,
  error: null,
  isLoading: false,
  message: null,

  // Helper to set the user and token
  setUser: (user, token) => {
    if (token) {
      persistToken(token);
      set({
        user: { ...user, token },
        isAuthenticated: true,
      });
    } else {
      persistToken(null);
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  /**
   * Signup request
   */
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });

      const { user, token, message } = response.data;

      if (token) {
        persistToken(token);
        set({
          user: { ...user, token },
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return message || "Signup successful. Please verify your email."; // Return success message
    } catch (error) {
      console.error("Signup error:", error);
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error; // Rethrow for the caller to handle
    }
  },

  /**
   * Login request
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      if (token) {
        persistToken(token);
        set({
          user: { ...user, token },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("Login failed: Token missing");
      }
    } catch (error) {
      console.error("Login error:", error);
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Logout request
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      persistToken(null);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  /**
   * Verify email request
   */
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });

      const { user, token } = response.data;

      if (token) {
        persistToken(token);
        set({
          user: { ...user, token },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.error("Token missing in email verification response");
      }
    } catch (error) {
      console.error("Verify email error:", error);
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Check if the user is authenticated (on page load)
   */
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);

      const { user, token } = response.data;

      if (user && token) {
        persistToken(token);
        set({
          user: { ...user, token },
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        throw new Error("Check auth failed: User or token missing");
      }
    } catch (error) {
      console.error("Check auth error:", error);
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  /**
   * Forgot password request
   */
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });

      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      console.error("Forgot password error:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  /**
   * Reset password request
   */
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });

      console.log("Reset password response:", response.data);

      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      console.error("Reset password error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
