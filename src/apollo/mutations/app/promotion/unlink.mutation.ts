import { gql } from '@apollo/client'
import { MESSAGE_FRAGMENT } from '@/apollo/fragments/message.fragment'
export const UNLINK_PRODUCT = gql`
  ${MESSAGE_FRAGMENT}
  mutation UnlinkProduct($promotion_id: Int, $product_id: Int) {
    unlinkProduct(promotion_id: $promotion_id, product_id: $product_id) {
      ...MessageFragment
    }
  }
`
