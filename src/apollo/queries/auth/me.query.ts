import { gql } from '@apollo/client'
import { USER_FRAGMENT } from '@/apollo/fragments/user.fragment'
export const GET_ME = gql`
  ${USER_FRAGMENT}
  query getMe {
    me {
      ...UserFragment
    }
  }
`
