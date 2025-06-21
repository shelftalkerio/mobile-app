import { gql } from '@apollo/client'

export const STORE_FRAGMENT = gql`
  fragment StoreFragment on Store {
    id
    name
    address
    address_2
    city
    postcode
    phone
  }
`
