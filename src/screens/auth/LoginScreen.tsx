import { useState } from 'react'
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useAuth } from '../../context/AuthContext'
import { AuthStackParamList } from '../../navigation/AuthNavigator'

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>

interface Props {
  navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)
  const { login, authenticateWithBiometrics } = useAuth()

  const handleLogin = async () => {
    try {
      setLoading(true)
      const success = await login(email, password)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    const username = await AsyncStorage.getItem('biometric_username')

    if (!username) {
      Toast.show({
        type: 'info',
        text1: 'Biometric Login Not Set Up',
        text2:
          'Please log in manually at least once to set up biometric login.',
      })
      return
    }
    setBioLoading(true)

    const success = await authenticateWithBiometrics()

    if (success) {
      const token = await AsyncStorage.getItem('access_token')

      if (token) {
      } else {
        Toast.show({
          type: 'error',
          text1: 'No token found',
          text2: 'Please log in manually at least once.',
        })
      }
    } else {
      setBioLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View className="mb-12">
            <Text className="text-4xl font-bold text-brand-black text-center mb-2">
              Welcome Back
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Sign in to continue scanning
            </Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-brand-black font-semibold mb-2">Email</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-brand-black"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-brand-black font-semibold mb-2">
                Password
              </Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-brand-black"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              className="bg-brand-green p-4 rounded-lg shadow-lg h-14"
              onPress={handleLogin}
              disabled={loading}
            >
              <View className="flex-1 justify-center items-center">
                {loading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="text-brand-white font-bold text-lg">
                      Signing In
                    </Text>
                  </View>
                ) : (
                  <Text className="text-brand-white font-bold text-lg">
                    Sign In
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4 py-3 px-5 bg-blue-600 rounded-lg shadow-lg h-14"
              onPress={handleBiometricLogin}
            >
              <View className="flex-1 justify-center items-center">
                {bioLoading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="text-brand-white font-bold text-lg">
                      Logining in...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-brand-white font-bold text-lg">
                    Login with Biometrics
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              className="py-2"
            >
              <Text className="text-brand-green text-center font-semibold">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-12">
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">Do not have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-brand-green font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
