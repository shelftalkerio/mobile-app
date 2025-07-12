import { Promotion } from '@/types/app/promotion'
import { ApolloError } from '@apollo/client'
export interface PromotionContextType {
  loading: boolean
  error?: ApolloError
  Promotion: Promotion | null
  unlinkPromoProductLoading: boolean
  unlinkPromoProductError?: ApolloError
  setPromotion: (Promotion: Promotion) => void
  clearPromotion: () => void
  getPromotion: (id: number) => Promise<Promotion | null>
  getPromotions: (id?: number, store_id?: number) => Promise<Promotion[] | null>
  unlinkPromoProduct: (
    promotion_id: number,
    product_id: number,
  ) => Promise<void>
}
