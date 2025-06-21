import React from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-20">
        <Image
            source={require('../assets/icon.png')}
            className="w-full"
            resizeMode="contain"
          />
      <ActivityIndicator size="large" color="#22c55e" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  );
}
