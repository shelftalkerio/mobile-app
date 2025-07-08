// context/CompanyContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

type CompanyContextType = {
  selectedCompanyId: number | null
  selectedStoreId: number | null
  setSelectedCompanyId: (id: number | null) => void
  setSelectedStoreId: (id: number | null) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  )
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('store_id')
      if (stored) setSelectedStoreId(Number(stored))
    }
    load()
  }, [])

  useEffect(() => {
    if (selectedStoreId !== null) {
      AsyncStorage.setItem('store_id', String(selectedStoreId))
    }
  }, [selectedStoreId])

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyId,
        selectedStoreId,
        setSelectedCompanyId,
        setSelectedStoreId,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (!context)
    throw new Error('useCompany must be used within a CompanyProvider')
  return context
}
