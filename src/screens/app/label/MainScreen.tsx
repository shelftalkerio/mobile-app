import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LabelCard from '@/components/LabelScreen/LabelCard'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect, useState } from 'react'
import { useCompany } from '@/context/CompanyContext'
import { useLabel } from '@/context/LabelContext'
import { Label } from '@/types/app/label'
import Ionicons from '@expo/vector-icons/build/Ionicons'

type RootStackParamList = {
  LabelDetailsScreen: { id: any }
  AnotherScreen: { id: string }
}
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'LabelDetailsScreen'
>

export default function LabelScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { selectedStoreId } = useCompany()
  const { getLabels } = useLabel()
  const [labels, setLabels] = useState<Label[]>([])

  useEffect(() => {
    if (selectedStoreId) {
      const fetchLabels = async () => {
        try {
          const results = await getLabels(selectedStoreId)
          setLabels(results ?? [])
        } catch (error) {
          console.error('Error fetching labels:', error)
        }
      }
      fetchLabels()
    }
  }, [selectedStoreId])

  return (
    <SafeAreaView className="flex-1 bg-brand-white space-y-5">
      <ScrollView className="flex-1 bg-white px-4 pt-10 space-y-5">
        <View className="flex-row items-center justify-between mb-4">
          {/* Heading Texts */}
          <View>
            <Text className="text-3xl font-bold text-black mb-1">Labels</Text>
            <Text className="text-gray-400 text-base">
              Labels linked to your store
            </Text>
          </View>

          {/* Go Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#22c55e" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-col space-y-4">
          {labels.map((label) => (
            <LabelCard
              key={label.id}
              serial={label.serial_number}
              code={label?.label_code ?? false}
              product={label?.product ?? false}
              onPress={() =>
                navigation.navigate('LabelDetailsScreen', {
                  id: label.id,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
