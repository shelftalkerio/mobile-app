import React from 'react'
import { SafeAreaView, View, Image, ActivityIndicator } from 'react-native'
import logo from '@/assets/images/logo/logo.png'

export default function LoadingPage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Image source={logo} className="w-12 h-12" resizeMode="contain" />
        <ActivityIndicator className="mt-5" />
      </View>
    </SafeAreaView>
  )
}
