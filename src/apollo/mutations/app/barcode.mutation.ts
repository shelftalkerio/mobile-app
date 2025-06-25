import { gql } from '@apollo/client'
export const SUBMIT_BARCODES = gql`
  mutation SubmitBarcodes($input: ScanInput) {
    submitBarcodes(input: $input) {
      message
    }
  }
`
