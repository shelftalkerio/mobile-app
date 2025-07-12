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
import { useProduct } from '@/context/ProductContext'
import { Product } from '@/types/app/product'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { AppTabParamList } from '@/types/AppTabParams'
import { useLabel } from '@/context/LabelContext'
import { usePromotion } from '@/context/PromotionContext'
import LoadingPage from '@/components/LoadingPage'
import ImagePreviewModal from '@/components/ImagePreviewModal'

type RouteParams = {
  ProductDetailsScreen: {
    id: number
  }
}

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>

export default function ProductDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'ProductDetailsScreen'>>()

  const { id } = route.params
  const navigation = useNavigation<AppTabNavigationProp>()

  const { getProduct, loading, error } = useProduct()
  const { disassociateLabel, disassociateLoading } = useLabel()
  const { unlinkPromoProduct, unlinkPromoProductLoading } = usePromotion()
  const [product, setProduct] = useState<Product | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleDisassociation = async (option: 'LABEL' | 'PRODUCT') => {
    try {
      await disassociateLabel(option, parseInt(product.id))
      navigation.navigate('Scanner')
    } catch (error) {
      console.error('Error handling option press:', error)
      setLocalError('Failed to handle option press')
    }
  }

  const hendleUnlinkPromoProduct = async (
    promotion_id: number,
    product_id: number,
  ) => {
    try {
      const result = await unlinkPromoProduct(
        Number(promotion_id),
        Number(product_id),
      )

      navigation.navigate('Product')
    } catch (error) {
      console.error('Error unlinking product from promotion:', error)
      setLocalError('Failed to unlink product from promotion')
    }
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await getProduct(id)
        setProduct(fetchedProduct)
      } catch (e) {
        console.error('Error', e)
        setLocalError('Failed to load Product')
      }
    }

    loadProduct()
  }, [id, setProduct])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <LoadingPage />
      </View>
    )
  }

  if (error || localError || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600">
          {localError || error?.message || 'Product not found'}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-6">
      <ScrollView className="flex-1 px-5 pt-6">
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100 relative">
          <Field product="Name" value={product.name} />
          <Field product="SKU" value={product.sku} />
          <Field
            product="Price"
            value={`£${Number(product.price_regular).toFixed(2)}`}
          />

          {product.base_64_info && (
            <View className="absolute bottom-4 right-4">
              <ImagePreviewModal base64Image={product.base_64_info} />
            </View>
          )}
        </View>

        <View className="h-px bg-gray-300 mb-6" />

        <View className="flex flex-col space-y-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Options
          </Text>
          {product.label && (
            <TouchableOpacity
              className="bg-red-600 rounded-xl px-4 py-4 flex-row items-center justify-center"
              onPress={() => handleDisassociation('PRODUCT')}
              disabled={disassociateLoading}
            >
              {disassociateLoading && (
                <ActivityIndicator size="small" color="#fff" className="mr-2" />
              )}
              <Text className="text-white text-base font-medium">
                Disassociate Label: {product.label.label_code}
              </Text>
            </TouchableOpacity>
          )}
          {product.promotion && (
            <TouchableOpacity
              className="bg-red-600 rounded-xl px-4 py-4 flex-row items-center justify-center"
              onPress={() =>
                hendleUnlinkPromoProduct(product.promotion.id, product.id)
              }
              disabled={unlinkPromoProductLoading}
            >
              {unlinkPromoProductLoading && (
                <ActivityIndicator size="small" color="#fff" className="mr-2" />
              )}
              <Text className="text-white text-base font-medium">
                Remove Promotion: {product.promotion.promotion_text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Field({
  product,
  value,
  valueClassName = 'text-gray-700',
}: {
  product: string
  value: string | number
  valueClassName?: string
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-500 font-semibold">{product}</Text>
      <Text className={`text-lg font-medium ${valueClassName}`}>{value}</Text>
    </View>
  )
}
