import { gql } from '@apollo/client'

export const PROMOTION_FRAGMENT = gql`
  fragment PromotionFragment on Promotion {
    id
    store {
      ...StoreFragment
    }
    is_on_promotion
    promotion_text
    promotion_end_date
    promotion_created_at
    promotion_source
    created_at
    updated_at
  }
`
