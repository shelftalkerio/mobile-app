import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Label } from '@/types/app/label'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_LABEL } from '@/apollo/queries/app/label.query'
import { DISASSOCIATE_PRODUCT } from '@/apollo/mutations/app/label/disassociate.mutation'
import { LabelContextType } from '@/types/contextProps/LabelContextType'
import Toast from 'react-native-toast-message'

const LabelContext = createContext<LabelContextType | undefined>(undefined)

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const [label, setLabelState] = useState<Label | null>(null)

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

  // getLabel now returns a Promise so you can await it
  const getLabel = async (
    id?: number,
    label_code?: string,
    store_id?: string,
  ): Promise<Label | null> => {
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
        labelLoading,
        labelError,
        disassociateLoading,
        disassociateError,
        getLabel,
        setLabel: setLabelState,
        disassociateLabel,
        clearLabel,
      }}
    >
      {children}
    </LabelContext.Provider>
  )
}

export const useLabelContext = (): LabelContextType => {
  const context = useContext(LabelContext)
  if (!context) {
    throw new Error('useLabelContext must be used within a LabelProvider')
  }
  return context
}
