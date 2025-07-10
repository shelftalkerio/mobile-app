import { gql } from '@apollo/client'
import { LABEL_FRAGMENT } from '@/apollo/fragments/label.fragment'
import { PROMOTION_FRAGMENT } from '@/apollo/fragments/promotion.fragment'
import { STORE_FRAGMENT } from '@/apollo/fragments/store.fragment'

export const PRODUCT_FRAGMENT = gql`
  ${LABEL_FRAGMENT}
  ${PROMOTION_FRAGMENT}
  ${STORE_FRAGMENT}
  fragment ProductFragment on Product {
    id
    name
    sku
    unit
    barcode
    price_regular
    price_sale
    price_sale_at
    price_sale_expires
    metadata {
      supplier
      loyalty_price
      loyalty_start
      loyalty_end
    }
    custom_fields
    status
    source
    synced_at
    thumbnail
    store {
      ...StoreFragment
    }
    promotion {
      ...PromotionFragment
    }
    label {
      ...LabelFragment
    }
    base_64_info
    created_at
    updated_at
  }
`
