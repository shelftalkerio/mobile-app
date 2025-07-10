import React, { useEffect, useRef, useState } from 'react'
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
import Ionicons from '@expo/vector-icons/build/Ionicons'
import LoadingPage from '@/components/LoadingPage'
import ImagePreviewModal from '@/components/ImagePreviewModal'
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
    labelLight,
    setLabelLightState,
    getLabel,
    labelLoading,
    labelError,
    disassociateLabel,
    disassociateLoading,
    triggerSwitchFlash,
  } = useLabel()
  const [label, setLabel] = useState<Label | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleOptionPress = async (option: 'LABEL' | 'PRODUCT') => {
    try {
      await disassociateLabel(option, parseInt(label.id))
      navigation.navigate('Scanner')
    } catch (error) {
      console.error('Disassociation failed', error)
      setLocalError('Failed to disassociate label')
    }
  }

  const turnOnFlash = async () => {
    if (labelLight === 'off') {
      setLabelLightState('on')

      const result = await triggerSwitchFlash(id)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setLabelLightState('off')
      }, 60000)
    } else {
      setLabelLightState('off')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
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
  }, [id, setLabel])

  if (labelLoading) {
    return <LoadingPage />
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
    <SafeAreaView className="flex-1 bg-gray-50 pb-6">
      <ScrollView className="flex-1 px-5 pt-6">
        {/* Label Info Card */}
        <View className="relative">
          {/* Flash Toggle Icon */}
          <TouchableOpacity
            onPress={turnOnFlash}
            disabled={labelLight === 'on'}
            className="absolute top-5 right-5 z-10 p-2"
          >
            <Ionicons
              name="bulb-outline"
              size={28}
              color={labelLight === 'on' ? '#facc15' : '#9ca3af'}
            />
          </TouchableOpacity>

          {/* Label Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
            <Field label="Label Code" value={label.label_code} />
            <Field label="Serial Number" value={label.serial_number} />
          </View>
          {label.base_64_info && (
            <View className="absolute bottom-4 right-4">
              <ImagePreviewModal base64Image={label.base_64_info} />
            </View>
          )}
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-300 mb-6" />

        {/* Options */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Options
          </Text>

          {label.product && (
            <TouchableOpacity
              className="bg-red-600 rounded-xl px-4 py-4 flex-row items-center justify-center"
              onPress={() => handleOptionPress('LABEL')}
              disabled={disassociateLoading}
            >
              {disassociateLoading && (
                <ActivityIndicator size="small" color="#fff" className="mr-2" />
              )}
              <Text className="text-white text-base font-medium">
                Disassociate Product
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
