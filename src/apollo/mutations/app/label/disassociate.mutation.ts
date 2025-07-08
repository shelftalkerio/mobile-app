import { gql } from '@apollo/client'
export const DISASSOCIATE_PRODUCT = gql`
  mutation DisassociateLabel($input: DisassociateInput) {
    disassociate(input: $input) {
      message
    }
  }
`
