import { Store } from './Store'
export interface Company {
  id: number
  name: string
  email: string
  website: string
  stores: Store[]
}
