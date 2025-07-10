import { gql } from '@apollo/client'
import { PROMOTION_FRAGMENT } from '@/apollo/fragments/promotion.fragment'
export const GET_PROMOTION = gql`
  ${PROMOTION_FRAGMENT}
  query getPromotion($id: ID, $store_id: Int) {
    promotion(id: $id, store_id: $store_id) {
      ...PromotionFragment
    }
  }
`
export const GET_PROMOTIONS = gql`
  ${PROMOTION_FRAGMENT}
  query getPromotions {
    promotions {
      ...PromotionFragment
    }
  }
`
