import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PromotionCard from '@/components/PromotionScreen/PromotionCard'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useState } from 'react'
import { useCompany } from '@/context/CompanyContext'
import { usePromotion } from '@/context/PromotionContext'
import { Promotion } from '@/types/app/promotion'
import Ionicons from '@expo/vector-icons/build/Ionicons'
import { useFocusEffect } from '@react-navigation/native'
import LoadingPage from '@/components/LoadingPage'
import { get } from 'node_modules/axios/index.cjs'

type RootStackParamList = {
  PromotionDetailsScreen: { id: any }
}
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'PromotionDetailsScreen'
>

export default function PromotionScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { selectedStoreId } = useCompany()
  const { getPromotions, loading } = usePromotion()
  const [promotions, setPromotions] = useState<Promotion[]>([])

  useFocusEffect(
    useCallback(() => {
      if (!selectedStoreId) return

      const fetchPromotions = async () => {
        try {
          const results = await getPromotions(undefined, selectedStoreId)
          setPromotions(results ?? [])
        } catch (error) {
          console.error('Error fetching promotions:', error)
        }
      }

      fetchPromotions()
    }, [selectedStoreId]),
  )

  if (loading) {
    return <LoadingPage />
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-white space-y-5">
      <ScrollView className="flex-1 bg-white px-4 pt-10 space-y-5">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-black mb-2">
              Promotions
            </Text>
            <Text className="text-gray-300 text-base">
              Promotions linked to your store
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#22c55e" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-col space-y-4">
          {promotions.length === 0 ? (
            <Text className="text-gray-500 text-center">
              There are no promotions.
            </Text>
          ) : (
            promotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                name={promotion.promotion_text}
                onPress={() =>
                  navigation.navigate('PromotionDetailsScreen', {
                    id: promotion.id,
                  })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
