import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LabelCardProps } from '@/types/app/label'

const LabelCard = ({ serial, code, product, onPress }: LabelCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col space-y-3 bg-white w-full rounded-xl p-4 border border-gray-200 mb-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-start flex-1 space-x-2">
          <Ionicons
            name="pricetag-outline"
            size={28}
            color="#22c55e"
            className="mr-3 mt-1"
          />
          <View>
            <Text className="text-lg font-semibold text-black">
              Code: {code}
            </Text>
            <Text className="text-gray-500 text-sm">Serial No.: {serial}</Text>
          </View>
        </View>

        <View className="ml-4 mt-6 space-y-1">
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </View>
      <View className="flex flex-row space-x-2">
        {product !== 'no-product' ? (
          <View className="bg-blue-100 px-2 py-0.5 rounded-full">
            <Text className="text-blue-700 text-xs font-semibold">Product</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export default LabelCard
