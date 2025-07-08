import { Product } from '@/types/app/product'
import { ApolloError } from '@apollo/client'
export interface ProductContextType {
  getProduct: (id: number) => Promise<Product | null>
  getProducts: (
    id?: number,
    sku?: string,
    store_id?: number,
  ) => Promise<Product[] | null>
  Product: Product | null
  setProduct: (Product: Product) => void
  clearProduct: () => void
  loading: boolean
  error?: ApolloError
}
