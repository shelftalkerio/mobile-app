import { gql, DocumentNode } from '@apollo/client'
import { TEMPLATE_FRAGMENT } from './template.fragment'
import { STORE_FRAGMENT } from './store.fragment'

export const LABEL_FRAGMENT = gql`
  ${TEMPLATE_FRAGMENT}
  ${STORE_FRAGMENT}
  fragment LabelFragment on Label {
    id
    label_code
    serial_number
    label_type
    resolution_width
    resolution_height
    battery_level
    signal_strength
    firmware_version
    model_number
    synced_at
    last_sync_status
    last_error_message
    status
    template {
      ...TemplateFragment
    }
    store {
      ...StoreFragment
    }
    product {
      id
    }
    template_url
    registered_at
    notes
    is_locked
    created_at
    updated_at
  }
`
