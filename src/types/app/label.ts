import { Product } from './product'

export interface Label {
  id: number
  label_code: string
  serial_number: string
  label_type: string
  resolution_width: number
  resolution_height: number
  battery_level: number
  signal_strength: number
  firmware_version: string
  model_number: string
  synced_at: string
  last_sync_status: string
  last_error_message?: string
  status: string
  template_url: string
  registered_at: string
  notes?: string
  is_locked: boolean
  product?: Product
}

export interface LabelCardProps {
  serial: string
  code: string
  product: 'product' | 'no-product'
  onPress?: () => void
}
