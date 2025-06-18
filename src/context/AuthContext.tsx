// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';
import { LOGIN_MUTATION } from '../apollo/mutations/auth/login.mutation';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [executeLogin] = useMutation(LOGIN_MUTATION);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data } = await executeLogin({
        variables: {
          input: { username, password },
        },
      });

      const {
        access_token,
        refresh_token,
        user: userData,
      } = data.login;

      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('refresh_token', refresh_token);

      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
