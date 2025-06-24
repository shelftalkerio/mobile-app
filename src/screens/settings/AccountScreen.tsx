import React, { useState } from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AccountScreen() {
  const { user } = useAuth()

  const companies = user?.companies ?? []

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  )
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)
  
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)
  
  useEffect(() => {
    if (companies.length === 1) {
      setSelectedCompanyId(companies[0].id)
    }
  }, [])
  
  useEffect(() => {
    if (selectedCompany) {
      const availableStores = selectedCompany.stores
      if (availableStores.length === 1) {
        setSelectedStoreId(availableStores[0].id)
      } else {
        setSelectedStoreId(null)
      }
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
    <SafeAreaView className="px-5">
      <View className="p-4 gap-4">
        <Text className="text-lg font-bold text-gray-800">Select Company</Text>
        <RNPickerSelect
          placeholder={{ label: 'Choose a company...', value: null }}
          onValueChange={(value) => {
            setSelectedCompanyId(value)
            setSelectedStoreId(null)
          }}
          items={companies.map((c) => ({ label: c.name, value: c.id }))}
          value={selectedCompanyId}
          useNativeAndroidPickerStyle={false}
          Icon={() => <Ionicons name="chevron-down" size={20} color="#555" />}
        />

        <Text className="text-lg font-bold text-gray-800">Select Store</Text>
        <RNPickerSelect
          placeholder={{ label: 'Choose a store...', value: null }}
          onValueChange={(value) => setSelectedStoreId(value)}
          items={
            selectedCompany
              ? selectedCompany.stores.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))
              : []
          }
          value={selectedStoreId}
          disabled={!selectedCompany}
          useNativeAndroidPickerStyle={false}
          Icon={() => <Ionicons name="chevron-down" size={20} color="#555" />}
        />
      </View>
    </SafeAreaView>
  )
}
