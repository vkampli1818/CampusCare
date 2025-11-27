import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Decode user info from token or fetch from backend if needed
      // Simplified: storing user info in localStorage for demo
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setReady(true);
  }, [token]);

  const login = (token, userInfo) => {
    setToken(token);
    setUser(userInfo);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
