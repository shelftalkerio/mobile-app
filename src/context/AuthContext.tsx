// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';
import { LOGIN_MUTATION } from '../apollo/mutations/auth/login.mutation';
import { REGISTER_MUTATION } from '../apollo/mutations/auth/register.mutation';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string ) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  resetPassword: async () => '',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [executeLogin] = useMutation(LOGIN_MUTATION);
  const [executeRegister] = useMutation(REGISTER_MUTATION);

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

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      const { data } = await executeRegister({
        variables: {
          input: { name, email, password, confirmPassword },
        },
      });
      console.log('Register Data: ', data)
      //TODO: Come back to this one.

      // const {
      //   access_token,
      //   refresh_token,
      //   user: userData,
      // } = data.regisrer;

      // await AsyncStorage.setItem('access_token', access_token);
      // await AsyncStorage.setItem('refresh_token', refresh_token);

      // setUser(userData);
      // setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };  

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string) =>  ''

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
