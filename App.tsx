import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ApplicationProvider } from './src/context/ApplicationContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashSceen';
import Toast from 'react-native-toast-message';
import client from './src/utils/client';
import './global.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {isAuthenticated ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ApplicationProvider>
        <AppContent />
        </ApplicationProvider>
      </AuthProvider>
      <Toast />
    </ApolloProvider>
  );
}