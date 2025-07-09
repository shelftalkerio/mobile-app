import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Label } from '@/types/app/label'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_LABEL } from '@/apollo/queries/app/label.query'
import { DISASSOCIATE_PRODUCT } from '@/apollo/mutations/app/label/disassociate.mutation'
import { SWITCH_FLASH } from '@/apollo/mutations/app/label/switch-flash.mutation'
import { LabelContextType } from '@/types/contextProps/LabelContextType'
import Toast from 'react-native-toast-message'

const LabelContext = createContext<LabelContextType | undefined>(undefined)

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const [label, setLabelState] = useState<Label | null>(null)
  const [labelLight, setLabelLightState] = useState<'on' | 'off'>('off')

  const [
    fetchLabel,
    { data: labelData, loading: labelLoading, error: labelError },
  ] = useLazyQuery(GET_LABEL, {
    onCompleted: (labelData) => {
      setLabelState(labelData.label)
    },
  })
  const [
    disassociateProduct,
    {
      data: disassociateData,
      loading: disassociateLoading,
      error: disassociateError,
    },
  ] = useMutation(DISASSOCIATE_PRODUCT)

  const [
    switchFlash,
    { data: switchData, loading: switchLoading, error: switchError },
  ] = useMutation(SWITCH_FLASH)

  const getLabel = async (id: number): Promise<Label[] | null> => {
    try {
      const result = await fetchLabel({ variables: { id } })
      const fetchedLabel = result?.data?.label ?? null
      setLabelState(fetchedLabel[0])
      return fetchedLabel[0]
    } catch (error) {
      console.error('Failed to fetch label', error)
      return null
    }
  }

  const getLabels = async (
    id?: number,
    label_code?: string,
    store_id?: string,
  ): Promise<Label[] | null> => {
    try {
      const result = await fetchLabel({
        variables: { id, label_code, store_id },
      })
      const fetchedLabel = result?.data?.label ?? null
      setLabelState(fetchedLabel)
      return fetchedLabel
    } catch (error) {
      console.error('Failed to fetch label', error)
      return null
    }
  }

  const triggerSwitchFlash = async (id: number): Promise<void> => {
    try {
      const result = await switchFlash({ variables: { id: Number(id) } })

      if (result.data?.switchFlash) {
        const flashStatus = result.data.switchFlash
        Toast.show({
          type: 'success',
          text1: flashStatus.message,
          position: 'top',
        })
        setLabelLightState(flashStatus.status === 'Success' ? 'on' : 'off')
      } else {
        Toast.show({
          type: 'error',
          text1: 'Flash Failed',
          text2: 'Failed to switch flash',
          position: 'bottom',
        })
      }
      return result.data?.switchFlash
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Flash Error',
        text2: error.message || 'An error occurred while switching flash',
        position: 'bottom',
      })
      return
    }
  }

  const disassociateLabel = async (
    type: 'LABEL' | 'PRODUCT',
    id: number,
  ): Promise<void> => {
    try {
      const result = await disassociateProduct({
        variables: { input: { type, id } },
      })
      if (result.data?.disassociate) {
        const disassociation = result.data.disassociate
        Toast.show({
          type: 'success',
          text1: disassociation.status,
          text2: disassociation.message,
          position: 'top',
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Disassociation Failed',
          text2: 'Failed to disassociate label',
          position: 'bottom',
        })
      }
      setLabelState(null)
    } catch (error) {
      console.error('Failed to disassociate label', error)
    }
  }

  const clearLabel = () => setLabelState(null)

  return (
    <LabelContext.Provider
      value={{
        label,
        labelLight,
        labelLoading,
        labelError,
        disassociateLoading,
        disassociateError,
        getLabel,
        getLabels,
        setLabel: setLabelState,
        disassociateLabel,
        clearLabel,
        triggerSwitchFlash,
        setLabelLightState,
      }}
    >
      {children}
    </LabelContext.Provider>
  )
}

export const useLabel = (): LabelContextType => {
  const context = useContext(LabelContext)
  if (!context) {
    throw new Error('useLabel must be used within a LabelProvider')
  }
  return context
}
