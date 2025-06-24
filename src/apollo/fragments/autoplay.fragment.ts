import { gql } from '@apollo/client'
import { USER_FRAGMENT } from './user.fragment'

export const AUTHPAYLOAD_FRAGMENT = gql`
  ${USER_FRAGMENT}
  fragment AuthPayloadFragment on AuthPayload {
    access_token
    refresh_token
    expires_in
    token_type
    user {
      ...UserFragment
    }
  }
`
