import { gql } from '@apollo/client'
import { MESSAGE_FRAGMENT } from '@/apollo/fragments/message.fragment'
export const SUBMIT_BARCODES = gql`
  ${MESSAGE_FRAGMENT}
  mutation SubmitBarcodes($input: ScanInput) {
    submitBarcodes(input: $input) {
      ...MessageFragment
    }
  }
`
