import { gql } from '@apollo/client'
import { PRODUCT_FRAGMENT } from '@/apollo/fragments/product.fragment'
export const GET_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  query getProduct($id: ID, $sku: String, $store_id: Int) {
    product(id: $id, sku: $sku, store_id: $store_id) {
      ...ProductFragment
    }
  }
`
export const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query getProducts {
    products {
      ...ProductFragment
    }
  }
`
