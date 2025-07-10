import { Label } from './label'
import { Store } from './store'
import { Promotion } from './promotion'

export interface Product {
  id: number
  name: string
  sku: string
  unit: string
  barcode: string
  price_regular: number
  price_sale: number
  price_sale_at: Date
  price_sale_expires: Date
  metadata: ProductMetadata
  custom_fields: string
  status: string
  source: string
  synced_at: Date
  thumbnail: string
  store: Store
  promotion: Promotion
  label: Label
  created_at: Date
  updated_at: Date
}

interface ProductMetadata {
  supplier: string
  loyalty_price: number
  loyalty_start: Date
  loyalty_end: Date
}

export interface ProductCardProps {
  name: string
  sku: string
  price: number
  label?: 'label' | 'no-label'
  promotion?: string | boolean
  onPress?: () => void
}
