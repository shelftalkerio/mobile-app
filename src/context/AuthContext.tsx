import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../apollo/mutations/auth/login.mutation'
import { REGISTER_MUTATION } from '../apollo/mutations/auth/register.mutation'
import Toast from 'react-native-toast-message'
import { AuthContextProps } from '@/types/contextProps/AuthContextProps'
import { GraphQLError } from 'graphql'
import * as LocalAuthentication from 'expo-local-authentication'

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [executeLogin] = useMutation(LOGIN_MUTATION)
  const [executeRegister] = useMutation(REGISTER_MUTATION)

  useEffect(() => {
    const checkAuth = async () => {
      // Add real token checking here later
      await new Promise<void>((resolve) => setTimeout(resolve, 2000))
      setIsAuthenticated(false)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const { data } = await executeLogin({
        variables: { input: { username, password } },
      })

      const { access_token, refresh_token, user } = data.login

      await AsyncStorage.multiSet([
        ['access_token', access_token],
        ['refresh_token', refresh_token],
        ['biometric_username', username],
        ['biometric_password', password],
      ])

      setUser(user)
      setIsAuthenticated(true)

      return true
    } catch (error: any) {
      const graphQLError: GraphQLError | undefined = error.graphQLErrors?.[0]
      const reason =
        String(graphQLError?.extensions?.reason) ??
        'Please check your credentials and try again.'

      console.error('Login Error:', error)

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: reason,
        position: 'bottom',
      })
      return false
    }
  }

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const supported = await LocalAuthentication.isEnrolledAsync()

      if (!hasHardware || !supported) {
        Toast.show({
          type: 'info',
          text1: 'Biometrics Not Supported',
          text2: 'Biometric authentication is not available on this device.',
          position: 'bottom',
        })
        return false
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
        fallbackLabel: 'Use Passcode',
      })

      if (!result.success) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Authentication failed.',
          position: 'bottom',
        })
        return false
      }

      const username = await AsyncStorage.getItem('biometric_username')
      const password = await AsyncStorage.getItem('biometric_password')

      if (!username || !password) {
        Toast.show({
          type: 'error',
          text1: 'Biometric Login Failed',
          text2: 'Stored credentials not found. Please login manually first.',
          position: 'bottom',
        })
        return false
      }

      return await login(username, password)
    } catch (error: any) {
      console.error('Biometric Auth Error:', error)
      const reason = error?.message ?? 'Something went wrong. Please try again.'

      Toast.show({
        type: 'error',
        text1: 'Biometric Login Failed',
        text2: reason,
        position: 'bottom',
      })
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ): Promise<boolean> => {
    try {
      const { data } = await executeRegister({
        variables: {
          input: { name, email, password, password_confirmation },
        },
      })

      console.log('Register Data:', data)
      // You can optionally auto-login here
      return true
    } catch (error) {
      console.error('Register Error:', error)
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: 'Please check your details and try again.',
        position: 'bottom',
      })
      return false
    }
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token'])
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        authenticateWithBiometrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
