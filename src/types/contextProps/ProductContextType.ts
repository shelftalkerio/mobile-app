import { Product } from '@/types/app/product'
import { ApolloError } from '@apollo/client'
export interface ProductContextType {
  getProduct: (id: number) => void
  Product: Product | null
  setProduct: (Product: Product) => void
  clearProduct: () => void
  loading: boolean
  error?: ApolloError
}
