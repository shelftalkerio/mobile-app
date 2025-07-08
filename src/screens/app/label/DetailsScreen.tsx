import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { AppTabParamList } from '@/types/AppTabParams'
import { useLabel } from '@/context/LabelContext'
import { Label } from '@/types/app/label'

type RouteParams = {
  LabelDetailsScreen: {
    id: number
  }
}

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>

export default function LabelDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'LabelDetailsScreen'>>()
  const { id } = route.params
  const navigation = useNavigation<AppTabNavigationProp>()
  const {
    getLabel,
    labelLoading,
    labelError,
    disassociateLabel,
    disassociateLoading,
  } = useLabel()
  const [label, setLabel] = useState<Label | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleOptionPress = async (option: 'LABEL' | 'PRODUCT') => {
    try {
      await disassociateLabel(option, parseInt(label.id))
      navigation.navigate('Scanner')
    } catch (error) {
      console.error('Disassociation failed', error)
      setLocalError('Failed to disassociate label')
    }
  }

  useEffect(() => {
    const loadLabel = async () => {
      try {
        const fetchedLabel = await getLabel(id)
        setLabel(fetchedLabel)
      } catch (e) {
        console.error('Error', e)
        setLocalError('Failed to load label')
      }
    }

    loadLabel()
  }, [id, setLabel]) // only runs when the ID changes

  if (labelLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>LabelLoading...</Text>
      </View>
    )
  }

  if (labelError || localError || !label) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600">
          {localError || labelError?.message || 'Label not found'}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white pb-14">
      <ScrollView className="flex-1 p-4">
        <Field label="Label Code" value={label.label_code} />
        <Field label="Serial Number" value={label.serial_number} />
        {/* Divider */}
        <View className="h-px bg-gray-300 my-6" />

        {/* Options Heading */}
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Options
        </Text>

        <TouchableOpacity
          className="bg-red-600 rounded-lg px-4 py-3 mb-3"
          onPress={() => handleOptionPress('LABEL')}
        >
          {disassociateLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : null}
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
