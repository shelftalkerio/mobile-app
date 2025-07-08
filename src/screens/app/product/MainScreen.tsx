import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProductCard from '@/components/ProductScreen/ProductCard'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect, useState } from 'react'
import { useCompany } from '@/context/CompanyContext'
import { useProduct } from '@/context/ProductContext'
import { Product } from '@/types/app/product'

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
  const { getProducts } = useProduct()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (selectedStoreId) {
      const fetchProducts = async () => {
        try {
          const results = await getProducts(selectedStoreId)
          setProducts(results ?? [])
        } catch (error) {
          console.error('Error fetching products:', error)
        }
      }

      fetchProducts()
    }
  }, [selectedStoreId])

  return (
    <SafeAreaView className="flex-1 bg-brand-white space-y-5">
      <ScrollView className="flex-1 bg-white px-4 pt-10 space-y-5">
        <View>
          <Text className="text-3xl font-bold text-black mb-2">Products</Text>
          <Text className="text-gray-300 text-base">
            Products linked to your store
          </Text>
        </View>

        <View className="flex flex-col space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              sku={product.sku}
              label={product.label?.label_code ?? false}
              promotion={product.label?.label_code ?? false}
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
