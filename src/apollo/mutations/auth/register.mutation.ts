import { gql } from '@apollo/client'
import { AUTHPAYLOAD_FRAGMENT } from '@/apollo/fragments/autoplay.fragment'

export const REGISTER_MUTATION = gql`
  ${AUTHPAYLOAD_FRAGMENT}
  mutation register($input: RegisterInput) {
    register(input: $input) {
      tokens {
        ...AuthPayloadFragment
      }
    }
  }
`
