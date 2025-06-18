import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import client from './src/utils/client';
import './global.css';

const Stack = createStackNavigator();

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
}