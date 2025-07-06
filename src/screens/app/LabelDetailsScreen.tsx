import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useLabelContext } from '@/context/LabelContext'
import { Label } from '@/types/app/label'

type RouteParams = {
  LabelDetailsScreen: {
    id: number
  }
}

export default function LabelDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'LabelDetailsScreen'>>()
  const { id } = route.params

  const { getLabel, loading, error } = useLabelContext()
  const [label, setLabel] = useState<Label | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleOptionPress = (option: string) => {
    console.log('Pressed:', option)
    // Handle navigation or actions here
  }

  useEffect(() => {
    const loadLabel = async () => {
      try {
        const fetchedLabel = await getLabel(id)
        // console.log('Label Data: ', fetchedLabel.label_code)
        setLabel(fetchedLabel)
        console.log('Label: ', label)
      } catch (e) {
        console.error('Error', e)
        setLocalError('Failed to load label')
      }
    }

    loadLabel()
  }, [id, setLabel]) // only runs when the ID changes

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error || localError || !label) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600">
          {localError || error?.message || 'Label not found'}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white pb-14">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Label Details</Text>
        <Field label="Label Code" value={label.label_code} />
        <Field label="Serial Number" value={label.serial_number} />
        {/* Divider */}
        <View className="h-px bg-gray-300 my-6" />

        {/* Options Heading */}
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Options
        </Text>

        {/* Buttons with NativeWind */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg px-4 py-3 mb-3"
          onPress={() => handleOptionPress('edit')}
        >
          <Text className="text-white text-center font-medium">Edit Label</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 rounded-lg px-4 py-3 mb-3"
          onPress={() => handleOptionPress('disassociate')}
        >
          <Text className="text-white text-center font-medium">
            Disassociate Product
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function Field({
  label,
  value,
  valueClassName = 'text-gray-700',
}: {
  label: string
  value: string | number
  valueClassName?: string
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-500 font-semibold">{label}</Text>
      <Text className={`text-lg font-medium ${valueClassName}`}>{value}</Text>
    </View>
  )
}
