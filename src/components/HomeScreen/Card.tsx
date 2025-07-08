import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type CardProps = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  onHandlePress?: () => void
}

export default function Card({
  icon,
  title,
  description,
  onHandlePress,
}: CardProps) {
  return (
    <TouchableOpacity
      className="bg-white w-[48%] rounded-xl p-4 border border-gray-200"
      onPress={onHandlePress}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Ionicons name={icon} size={28} color="#22c55e" />
          <Text className="text-lg font-semibold text-black mt-2">{title}</Text>
          <Text className="text-gray-500 text-sm">{description}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#9ca3af" // Tailwind gray-400
        />
      </View>
    </TouchableOpacity>
  )
}
