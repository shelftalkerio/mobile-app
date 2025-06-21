import { gql } from '@apollo/client'
import { COMPANY_FRAGMENT } from './company.fragment'

export const USER_FRAGMENT = gql`
  ${COMPANY_FRAGMENT}
  fragment UserFragment on User {
    id
    name
    email
    companies {
      ...CompanyFragment
    }
  }
`
