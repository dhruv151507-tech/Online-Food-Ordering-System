import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    
    if (token && role) {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Backend expects RequestParams, so we send it as form data or query params
      const response = await api.post(`/user/login?username=${username}&password=${password}`);
      const token = response.data; // token string
      
      // Since we don't have an endpoint to get user details without doing JWT decode
      // And the structure of the JWT isn't 100% known, let's parse the JWT.
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      console.log('Decoded token:', decoded);
      // Let's assume decoded contains role somewhere, or we can check what we get
      // If the backend adds 'role' properly to the claims.
      const userRole = decoded.role || decoded.roles || 'CUSTOMER'; // fallback
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('username', username);
      
      setUser({ token, role: userRole, username });
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/user/register', userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error', error);
      let message = 'Registration failed. Username may be taken.';
      
      if (!error.response) {
        message = 'Network error: Cannot connect to server.';
      } else if (error.response.status === 400) {
        message = 'username should be in proper format';
      }
      
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
