import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProductCard from '@/components/ProductScreen/ProductCard'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useState } from 'react'
import { useCompany } from '@/context/CompanyContext'
import { useProduct } from '@/context/ProductContext'
import { Product } from '@/types/app/product'
import Ionicons from '@expo/vector-icons/build/Ionicons'
import { useFocusEffect } from '@react-navigation/native'
import LoadingPage from '@/components/LoadingPage'

type RootStackParamList = {
  LabelDetailsScreen: { label: any }
  ProductDetailsScreen: { id: any }
  AnotherScreen: { id: string }
}
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetailsScreen'
>

export default function ProductScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { selectedStoreId } = useCompany()
  const { getProducts, loading } = useProduct()
  const [products, setProducts] = useState<Product[]>([])

  useFocusEffect(
    useCallback(() => {
      if (!selectedStoreId) return

      const fetchProducts = async () => {
        try {
          const results = await getProducts(selectedStoreId)
          setProducts(results ?? [])
        } catch (error) {
          console.error('Error fetching products:', error)
        }
      }

      fetchProducts()
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
            <Text className="text-3xl font-bold text-black mb-2">Products</Text>
            <Text className="text-gray-300 text-base">
              Products linked to your store
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#22c55e" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-col space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              sku={product.sku}
              label={product.label ? 'label' : 'no-label'}
              promotion={product.promotion ? 'promotion' : 'no-promotion'}
              price={product.price_regular ?? 0}
              onPress={() =>
                navigation.navigate('ProductDetailsScreen', {
                  id: product.id,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
