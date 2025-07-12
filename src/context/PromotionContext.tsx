import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Promotion } from '@/types/app/promotion'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_PROMOTION } from '@/apollo/queries/app/promotion.query'
import { PromotionContextType } from '@/types/contextProps/PromotionContextType'
import { UNLINK_PRODUCT } from '@/apollo/mutations/app/promotion/unlink.mutation'
import { saveScannedItem } from '@/utils/storage'
import Toast from 'react-native-toast-message'
import uuid from 'react-native-uuid'

const PromotionContext = createContext<PromotionContextType | undefined>(
  undefined,
)

export const PromotionProvider = ({ children }: { children: ReactNode }) => {
  const uid = uuid.v4() as string
  const [Promotion, setPromotionState] = useState<Promotion | null>(null)
  const [
    unlinkProduct,
    {
      data: unlinkPromoProductData,
      loading: unlinkPromoProductLoading,
      error: unlinkPromoProductError,
    },
  ] = useMutation(UNLINK_PRODUCT)

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

  const unlinkPromoProduct = async (
    promotion_id: number,
    product_id: number,
  ): Promise<void> => {
    try {
      const result = await unlinkProduct({
        variables: { promotion_id, product_id },
      })

      if (result.data?.unlinkProduct) {
        const unlinkProduct = result?.data?.unlinkProduct
        saveScannedItem({
          id: uid,
          type: 'Promotion',
          data: JSON.stringify({ message: unlinkProduct?.message }),
          timestamp: new Date().toISOString(),
        })
        Toast.show({
          type: 'success',
          text1: unlinkProduct.status,
          text2: unlinkProduct.message,
          position: 'top',
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unlink Product Failed',
          text2: 'Failed to unlink product from promotion',
          position: 'bottom',
        })
      }
    } catch (error) {
      console.error('Failed to unlinkProduct', error)
    }
  }

  const clearPromotion = () => setPromotionState(null)

  return (
    <PromotionContext.Provider
      value={{
        loading,
        error,
        Promotion,
        unlinkPromoProductLoading,
        unlinkPromoProductError,
        setPromotion: setPromotionState,
        clearPromotion,
        getPromotion,
        getPromotions,
        unlinkPromoProduct,
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
