import React from 'react'
import { View, ActivityIndicator, Text, Image } from 'react-native'
import icon from '@/assets/icon.png'

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-20">
      <Image source={icon} className="w-full" resizeMode="contain" />
      <ActivityIndicator size="large" color="#22c55e" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  )
}
