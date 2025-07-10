import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Promotion } from '@/types/app/promotion'
import { useLazyQuery } from '@apollo/client'
import { GET_PROMOTION } from '@/apollo/queries/app/promotion.query'
import { PromotionContextType } from '@/types/contextProps/PromotionContextType'

const PromotionContext = createContext<PromotionContextType | undefined>(
  undefined,
)

export const PromotionProvider = ({ children }: { children: ReactNode }) => {
  const [Promotion, setPromotionState] = useState<Promotion | null>(null)

  const [fetchPromotions, { loading, error, data }] = useLazyQuery(
    GET_PROMOTION,
    {
      onCompleted: (data) => {
        setPromotionState(data.Promotion)
      },
    },
  )

  const getPromotion = async (id: number): Promise<Promotion | null> => {
    try {
      const result = await fetchPromotions({ variables: { id } })
      const fetchedPromotion = result?.data?.promotion ?? null
      setPromotionState(fetchedPromotion[0])
      return fetchedPromotion[0]
    } catch (error) {
      console.error('Failed to fetch Promotion', error)
      return null
    }
  }

  const getPromotions = async (
    id?: number,
    store_id?: number,
  ): Promise<Promotion[] | null> => {
    try {
      const result = await fetchPromotions({
        variables: { id, store_id: Number(store_id) },
      })
      const fetchedPromotions = result?.data?.promotion ?? null

      setPromotionState(fetchedPromotions)
      return fetchedPromotions
    } catch (error) {
      console.error('Failed to fetch Promotion', error)
      return null
    }
  }

  const clearPromotion = () => setPromotionState(null)

  return (
    <PromotionContext.Provider
      value={{
        getPromotion,
        getPromotions,
        Promotion,
        setPromotion: setPromotionState,
        clearPromotion,
        loading,
        error,
      }}
    >
      {children}
    </PromotionContext.Provider>
  )
}

export const usePromotion = (): PromotionContextType => {
  const context = useContext(PromotionContext)
  if (!context) {
    throw new Error('usePromotion must be used within a PromotionProvider')
  }
  return context
}
