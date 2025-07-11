import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type QuickActionProps = {
  title: string
}

export default function QuickAction({ title }: QuickActionProps) {
  return (
    <TouchableOpacity className="bg-white w-full mb-5">
      <View className="rounded-xl p-4 border border-gray-200">
        <View className="w-full flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-black mt-2">
              {title}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  )
}
