import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Label } from '@/types/app/label'
import { useLazyQuery } from '@apollo/client'
import { GET_LABEL } from '@/apollo/queries/app/label.query'
import { LabelContextType } from '@/types/contextProps/LabelContextType'

const LabelContext = createContext<LabelContextType | undefined>(undefined)

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const [label, setLabelState] = useState<Label | null>(null)

  const [fetchLabel, { loading, error, data }] = useLazyQuery(GET_LABEL, {
    onCompleted: (data) => {
      setLabelState(data.label)
    },
  })

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

  const clearLabel = () => setLabelState(null)

  return (
    <LabelContext.Provider
      value={{
        getLabel,
        label,
        setLabel: setLabelState,
        clearLabel,
        loading,
        error,
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
