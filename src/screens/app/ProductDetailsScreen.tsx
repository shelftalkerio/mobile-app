import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useProductContext } from '@/context/ProductContext'
import { Product } from '@/types/app/product'

type RouteParams = {
  ProductDetailsScreen: {
    id: number
  }
}

export default function ProductDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'ProductDetailsScreen'>>()
  const { id } = route.params

  const { getProduct, loading, error } = useProductContext()
  const [product, setProduct] = useState<Product | any>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleOptionPress = (option: string) => {
    console.log('Pressed:', option)
    // Handle navigation or actions here
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

  return (
    <SafeAreaView className="flex-1 bg-white pb-14">
      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-2xl font-bold mb-6">Product Details</Text>

        <Field product="Name" value={product.name} />
        <Field product="SKU" value={product.sku} />

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
          <Text className="text-white text-center font-medium">
            Edit Product
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 rounded-lg px-4 py-3 mb-3"
          onPress={() => handleOptionPress('disassociate')}
        >
          <Text className="text-white text-center font-medium">
            Disassociate Label
          </Text>
        </TouchableOpacity>
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
