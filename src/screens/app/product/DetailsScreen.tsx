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

type RouteParams = {
  ProductDetailsScreen: {
    id: number
  }
}

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>

export default function ProductDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'ProductDetailsScreen'>>()
  console.log('Route params:', route.params)
  const { id } = route.params
  const navigation = useNavigation<AppTabNavigationProp>()

  const { getProduct, loading, error } = useProduct()
  const { disassociateLabel, disassociateLoading } = useLabel()
  const [product, setProduct] = useState<Product | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleOptionPress = async (option: 'LABEL' | 'PRODUCT') => {
    try {
      await disassociateLabel(option, parseInt(product.id))
      navigation.navigate('Scanner')
    } catch (error) {
      console.error('Error handling option press:', error)
      setLocalError('Failed to handle option press')
    }
  }

  useEffect(() => {
    console.log('ProductDetailsScreen useEffect', id)
    const loadProduct = async () => {
      try {
        const fetchedProduct = await getProduct(id)
        // console.log('Fetched Product:', fetchedProduct)
        setProduct(fetchedProduct)
      } catch (e) {
        console.error('Error', e)
        setLocalError('Failed to load Product')
      }
    }

    loadProduct()
  }, [id, setProduct]) // only runs when the ID changes

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
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

  // console.log('ProductDetailsScreen product', product)

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-6">
      <ScrollView className="flex-1 px-5 pt-6">
        {/* Product Info Card */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
          <Field product="Name" value={product.name} />
          <Field product="SKU" value={product.sku} />
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-300 mb-6" />

        {/* Options */}
        {product.label && (
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Options
            </Text>

            <TouchableOpacity
              className="bg-red-600 rounded-xl px-4 py-4 flex-row items-center justify-center"
              onPress={() => handleOptionPress('PRODUCT')}
              disabled={disassociateLoading}
            >
              {disassociateLoading && (
                <ActivityIndicator size="small" color="#fff" className="mr-2" />
              )}
              <Text className="text-white text-base font-medium">
                Disassociate Label
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
