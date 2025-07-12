import { gql } from '@apollo/client'
import { MESSAGE_FRAGMENT } from '@/apollo/fragments/message.fragment'
export const DISASSOCIATE_PRODUCT = gql`
  ${MESSAGE_FRAGMENT}
  mutation DisassociateLabel($input: DisassociateInput) {
    disassociate(input: $input) {
      ...MessageFragment
    }
  }
`
