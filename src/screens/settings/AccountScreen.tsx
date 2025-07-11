import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useCompany } from '@/context/CompanyContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Dropdown from '@/components/Inputs/Dropdown'

export default function AccountScreen() {
  const { user } = useAuth()
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    selectedStoreId,
    setSelectedStoreId,
  } = useCompany()

  const companies = user?.companies ?? []

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)

  useEffect(() => {
    if (companies.length === 1) {
      AsyncStorage.setItem('company_id', String(companies[0].id))
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
        <Dropdown
          title="Choose a company"
          options={companies.map((c) => ({ label: c.name, value: c.id }))}
          value={selectedCompanyId}
          onSelect={(value) => {
            setSelectedCompanyId(value)
            setSelectedStoreId(null)
          }}
        />
        <Dropdown
          title="Choose a store"
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
    </SafeAreaView>
  )
}
