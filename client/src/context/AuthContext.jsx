import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.token) {
      // Verify token/fetch profile on mount if needed
      // Keeping it simple for now, relying on local storage
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const register = async (name, email, password, campus) => {
    await apiFetch('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, campus }),
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const refreshProfile = async () => {
    try {
      const data = await apiFetch('/users/profile');
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
