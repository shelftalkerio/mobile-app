import { gql } from '@apollo/client'
import { AUTHPAYLOAD_FRAGMENT } from './../../fragments/autoplay.fragment'

export const LOGIN_MUTATION = gql`
  ${AUTHPAYLOAD_FRAGMENT}
  mutation login($input: LoginInput) {
    login(input: $input) {
      ...AuthPayloadFragment
    }
  }
`
