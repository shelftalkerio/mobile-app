import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ProductCardProps } from '@/types/app/product'

export default function ProductCard({
  name,
  sku,
  price,
  label,
  promotion,
  onPress,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col space-y-3 bg-white w-full rounded-xl p-4 border border-gray-200 mb-4"
    >
      <View className="flex-row items-center justify-between">
        {/* Left: Icon + Info */}
        <View className="flex-row items-start flex-1">
          <Ionicons
            name="cube-outline"
            size={28}
            color="#22c55e"
            className="mr-3 mt-1"
          />
          <View>
            <Text className="text-lg font-semibold text-black">{name}</Text>
            <Text className="text-gray-500 text-sm">SKU: {sku}</Text>
            <Text className="text-gray-800 font-medium mt-1">
              £{price.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Right: Tags + Chevron */}
        <View className="fkitems-end space-y-1 ml-4">
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </View>
      <View className="flex flex-row space-x-2">
        {label && (
          <View className="bg-green-100 px-2 py-0.5 rounded-full">
            <Text className="text-green-700 text-xs font-semibold">Label</Text>
          </View>
        )}
        {promotion && (
          <View className="bg-yellow-100 px-2 py-0.5 rounded-full">
            <Text className="text-yellow-700 text-xs font-semibold">
              Promotion
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
