import { gql } from '@apollo/client'
export const QUERY_BARCODE = gql`
  query validateBarcode($barcode: String!) {
    validateBarcode(barcode: $barcode) {
      code
      type
      valid
      associated
      message
    }
  }
`
