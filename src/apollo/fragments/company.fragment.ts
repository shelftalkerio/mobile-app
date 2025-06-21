import { gql } from '@apollo/client'
import { STORE_FRAGMENT } from './store.fragment'

export const COMPANY_FRAGMENT = gql`
  ${STORE_FRAGMENT}
  fragment CompanyFragment on Company {
    id
    name
    email
    website
    stores {
      ...StoreFragment
    }
  }
`
