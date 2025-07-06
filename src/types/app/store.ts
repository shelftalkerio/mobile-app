import { Company } from '../Company'
export interface Store {
  id: number
  name: string
  address: string
  address_2: String
  city: string
  postcode: string
  phone: string
  company: Company
  created_at: Date
  updated_at: Date
}
