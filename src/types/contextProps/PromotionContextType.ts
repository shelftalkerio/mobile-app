import { Promotion } from '@/types/app/promotion'
import { ApolloError } from '@apollo/client'
export interface PromotionContextType {
  getPromotion: (id: number) => Promise<Promotion | null>
  getPromotions: (id?: number, store_id?: number) => Promise<Promotion[] | null>
  Promotion: Promotion | null
  setPromotion: (Promotion: Promotion) => void
  clearPromotion: () => void
  loading: boolean
  error?: ApolloError
}
