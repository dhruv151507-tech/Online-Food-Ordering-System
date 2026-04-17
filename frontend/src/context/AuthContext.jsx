import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const extractErrorMessage = (error, fallbackMessage) => {
  if (!error.response) {
    return "Network error: Cannot connect to server.";
  }

  const data = error.response.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (token && role) {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data; // token string

      // Since we don't have an endpoint to get user details without doing JWT decode
      // And the structure of the JWT isn't 100% known, let's parse the JWT.
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );

      const decoded = JSON.parse(jsonPayload);
      console.log("Decoded token:", decoded);
      // Let's assume decoded contains role somewhere, or we can check what we get
      // If the backend adds 'role' properly to the claims.
      const userRole = decoded.role || decoded.roles || "CUSTOMER"; // fallback

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("username", username);

      setUser({ token, role: userRole, username });
      return { success: true };
    } catch (error) {
      console.error("Login error", error);
      return {
        success: false,
        message: extractErrorMessage(error, "Login failed."),
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return { success: true, message: response.data };
    } catch (error) {
      console.error("Registration error", error);
      let message = "Registration failed.";

      if (error.response?.status === 400) {
        message = extractErrorMessage(error, message);
      } else {
        message = extractErrorMessage(error, message);
      }

      return { success: false, message };
    }
  };

  const verifyOtp = async ({ username, otp }) => {
    try {
      await api.post("/auth/verify-otp", { username, otp });
      return { success: true };
    } catch (error) {
      console.error("OTP verification error", error);
      const message = extractErrorMessage(error, "OTP verification failed.");

      return { success: false, message };
    }
  };

  const resendOtp = async (email) => {
    try {
      await api.post("/auth/resend-otp", { email });
      return { success: true, message: "OTP sent successfully!" };
    } catch (error) {
      console.error("Resend OTP error", error);
      const message = extractErrorMessage(error, "Failed to resend OTP.");

      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, verifyOtp, resendOtp, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
