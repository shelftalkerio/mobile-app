import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { ApolloProvider } from '@apollo/client'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { ApplicationProvider } from './src/context/ApplicationContext'
import { CompanyProvider } from './src/context/CompanyContext'
import { LabelProvider } from './src/context/LabelContext'
import { ProductProvider } from './src/context/ProductContext'
import AuthNavigator from './src/navigation/AuthNavigator'
import RootNavigator from './src/navigation/RootNavigator'
import SplashScreen from './src/screens/SplashSceen'
import Toast from 'react-native-toast-message'
import client from './src/utils/client'
import './global.css'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {isAuthenticated ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ApplicationProvider>
          <CompanyProvider>
            <LabelProvider>
              <ProductProvider>
                <AppContent />
              </ProductProvider>
            </LabelProvider>
          </CompanyProvider>
        </ApplicationProvider>
      </AuthProvider>
      <Toast />
    </ApolloProvider>
  )
}
