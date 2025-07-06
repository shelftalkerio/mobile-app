import { Store } from '../Store'
export interface Promotion {
  id: number
  store: Store
  is_on_promotion: boolean
  promotion_text: string
  promotion_end_date: Date
  promotion_created_at: Date
  promotion_source: string
  created_at: Date
  updated_at: Date
}
