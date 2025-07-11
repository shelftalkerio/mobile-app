import React, { useEffect } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeScreenCard from '@/components/HomeScreen/Card'
import QuickAction from '@/components/HomeScreen/QuickAction'
import ProfileIconButton from '@/components/Buttons/ProfileIconButton'
import logo from '@/assets/images/logo/logo.png'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { AppTabParamList } from '@/types/AppTabParams'
import { useAuth } from '@/context/AuthContext'
import { useCompany } from '@/context/CompanyContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Dropdown from '@/components/Inputs/Dropdown'

type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>

export default function HomeScreen() {
  const navigation = useNavigation<AppTabNavigationProp>()
  const { user } = useAuth()
  const {
    selectedCompanyId,
    selectedStoreId,
    setSelectedCompanyId,
    setSelectedStoreId,
  } = useCompany()
  const selectedCompany = user?.companies?.find(
    (c) => c.id === selectedCompanyId,
  )

  useEffect(() => {
    if (user?.companies?.length === 1) {
      setSelectedCompanyId(user.companies[0].id)
    }
    if (selectedCompany?.stores?.length === 1) {
      setSelectedStoreId(selectedCompany.stores[0].id)
    } else {
      setSelectedStoreId(null)
    }
  }, [selectedCompany])

  useEffect(() => {
    if (selectedStoreId) {
      AsyncStorage.setItem('store_id', String(selectedStoreId)).catch(
        (error) => {
          console.error('Error saving store ID:', error)
        },
      )
    }
  }, [selectedStoreId])

  return (
    <SafeAreaView className="flex-1 bg-brand-white justify-center items-center">
      <ScrollView className="flex-1 bg-white px-4 pt-10 space-y-5 w-full">
        {/* Header */}
        <View className="flex flex-row justify-between items-center w-full">
          <Image source={logo} className="w-8 h-8" resizeMode="contain" />
          <ProfileIconButton />
        </View>

        {/* Welcome + Store Dropdown */}
        <View className="flex-row justify-between items-start mb-4">
          <View>
            <Text className="text-3xl font-bold text-black mb-2">Welcome</Text>
            <Text className="text-gray-300 text-base">
              What would you like to manage today?
            </Text>
          </View>

          <View className="-right-4 -top-5 absolute w-1/2 h-20">
            <Dropdown
              options={
                selectedCompany
                  ? selectedCompany.stores.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))
                  : []
              }
              value={selectedStoreId}
              onSelect={(value) => setSelectedStoreId(value)}
            />
          </View>
        </View>

        {/* Feature Cards */}
        <View className="flex-row justify-between mb-4">
          <HomeScreenCard
            icon="cube-outline"
            title="Products"
            description="Manage inventory"
            onHandlePress={() => navigation.navigate('Product')}
          />
          <HomeScreenCard
            icon="pricetag-outline"
            title="Labels"
            description="Assign label tags"
            onHandlePress={() => navigation.navigate('Label')}
          />
        </View>

        <View className="flex-row justify-between mb-4">
          <HomeScreenCard
            icon="megaphone-outline"
            title="Promotions"
            description="Track deals"
            onHandlePress={() => navigation.navigate('Promotion')}
          />
          <HomeScreenCard
            icon="print-outline"
            title="Printer"
            description="Connect to printer"
          />
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between">
          <Text className="text-2xl font-bold text-black">Quick Actions</Text>
        </View>

        <View className="flex flex-col space-y-5">
          <QuickAction title="Add a Promotion" />
          <QuickAction title="Discount a product" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
