import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../apollo/mutations/auth/login.mutation'
import { REGISTER_MUTATION } from '../apollo/mutations/auth/register.mutation'
import Toast from 'react-native-toast-message'
import { AuthContextProps } from '@/types/contextProps/AuthContextProps'
import { GraphQLError } from 'graphql'
import { ApolloError } from '@apollo/client'

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  // resetPassword: async () => '',
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  const [executeLogin] = useMutation(LOGIN_MUTATION)
  const [executeRegister] = useMutation(REGISTER_MUTATION)

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000))

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
        variables: {
          input: { username, password },
        },
      })

      const { access_token, refresh_token, user } = data.login

      await AsyncStorage.setItem('access_token', access_token)
      await AsyncStorage.setItem('refresh_token', refresh_token)

      setUser(user)
      setIsAuthenticated(true)

      return true
    } catch (error: any) {
      const graphQLError: GraphQLError | undefined = error.graphQLErrors[0]
      const reason =
        String(graphQLError?.extensions?.reason) ??
        'Please check your credentials and try again.'
      console.log('Error', error)
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
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

      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  // const resetPassword = async (email: string) => ''

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        // resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
