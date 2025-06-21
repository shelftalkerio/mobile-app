import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
// import { useAuth } from '../../context/AuthContext'
import { AuthStackParamList } from '../../navigation/AuthNavigator'

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>

interface Props {
  navigation: RegisterScreenNavigationProp
}

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  // const { register } = useAuth()

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    // try {
    //   const success = await register(name, email, password)
    //   if (!success) {
    //     Alert.alert('Error', 'Registration failed')
    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'Registration failed. Please try again.')
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-8 py-12">
            <View className="mb-8">
              <Text className="text-4xl font-bold text-brand-black text-center mb-2">
                Create Account
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                Join us to start scanning
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-brand-black font-semibold mb-2">
                  Full Name
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-lg text-brand-black"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                />
              </View>

              <View>
                <Text className="text-brand-black font-semibold mb-2">
                  Email
                </Text>
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
                  autoComplete="password-new"
                />
              </View>

              <View>
                <Text className="text-brand-black font-semibold mb-2">
                  Confirm Password
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-lg text-brand-black"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoComplete="password-new"
                />
              </View>

              <TouchableOpacity
                className="bg-brand-green p-4 rounded-lg shadow-lg mt-6"
                onPress={handleRegister}
                disabled={loading}
              >
                <Text className="text-brand-white font-bold text-center text-lg">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8">
              <View className="flex-row justify-center items-center">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-brand-green font-semibold">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
