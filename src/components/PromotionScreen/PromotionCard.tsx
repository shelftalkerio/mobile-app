import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { PromotionCardProps } from '@/types/app/promotion'

export default function PromotionCard({ name, onPress }: PromotionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col space-y-3 bg-white w-full rounded-xl p-4 border border-gray-200 mb-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-start flex-1 space-x-2">
          <Ionicons
            name="cube-outline"
            size={28}
            color="#22c55e"
            className="mr-3 mt-1"
          />
          <View>
            <Text className="text-lg font-semibold text-black">{name}</Text>
          </View>
        </View>

        <View className="space-y-1 ml-4">
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  )
}
