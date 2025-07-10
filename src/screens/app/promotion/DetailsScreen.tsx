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
import { usePromotion } from '@/context/PromotionContext'
import { Promotion } from '@/types/app/promotion'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { AppTabParamList } from '@/types/AppTabParams'
import { useLabel } from '@/context/LabelContext'
import LoadingPage from '@/components/LoadingPage'
import ImagePreviewModal from '@/components/ImagePreviewModal'

type RouteParams = {
  PromotionDetailsScreen: {
    id: number
  }
}

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>

export default function PromotionDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'PromotionDetailsScreen'>>()

  const { id } = route.params
  const navigation = useNavigation<AppTabNavigationProp>()

  const { getPromotion, loading, error } = usePromotion()
  const { disassociateLabel, disassociateLoading } = useLabel()
  const [promotion, setPromotion] = useState<Promotion | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleOptionPress = async (option: 'LABEL' | 'PRODUCT') => {
    try {
      await disassociateLabel(option, parseInt(promotion.id))
      navigation.navigate('Scanner')
    } catch (error) {
      console.error('Error handling option press:', error)
      setLocalError('Failed to handle option press')
    }
  }

  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const fetchedPromotion = await getPromotion(id)
        setPromotion(fetchedPromotion)
      } catch (e) {
        console.error('Error', e)
        setLocalError('Failed to load Promotion')
      }
    }

    loadPromotion()
  }, [id, setPromotion]) // only runs when the ID changes

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <LoadingPage />
      </View>
    )
  }

  if (error || localError || !promotion) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600">
          {localError || error?.message || 'Promotion not found'}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-6">
      <ScrollView className="flex-1 px-5 pt-6">
        {/* Promotion Info Card */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100 relative">
          <Field
            valueClassName="text-lg"
            promotion="Name"
            value={promotion.promotion_text}
          />
          <View className="flex-row justify-between">
            <Field
              valueClassName="text-sm"
              promotion="Created At"
              value={new Date(promotion.promotion_created_at).toLocaleString()}
            />
            <Field
              valueClassName="text-sm"
              promotion="End Date"
              value={new Date(promotion.promotion_end_date).toLocaleString()}
            />
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-300 mb-6" />

        {/* Options */}

        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Options
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Field({
  promotion,
  value,
  valueClassName = 'text-gray-700',
}: {
  promotion: string
  value: string | number
  valueClassName?: string
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-500 font-semibold text-sm">
        {promotion}
      </Text>
      <Text className={`font-medium ${valueClassName}`}>{value}</Text>
    </View>
  )
}
