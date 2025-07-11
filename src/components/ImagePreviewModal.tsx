import React, { useState } from 'react'
import {
  View,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function ImagePreviewModal({
  base64Image,
}: {
  base64Image: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <View className="flex items-center justify-center p-4">
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Ionicons name="image-outline" size={28} color="#1f2937" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white p-4 rounded-lg shadow-md w-11/12 max-h-[90%]">
            <Image
              source={{ uri: `data:image/png;base64,${base64Image}` }}
              className="w-full h-72 mb-4 rounded"
              resizeMode="contain"
            />
            <Pressable
              onPress={() => setVisible(false)}
              className="mt-2 bg-green-500 px-4 py-2 rounded"
            >
              <Text className="text-white text-center">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}
