import { gql } from '@apollo/client'
export const QUERY_BARCODE = gql`
  query ValidateBarcode($barcode: String!) {
    validateBarcode(barcode: $barcode) {
      type # "LABEL" or "PRODUCT"
      valid # true or false
      message
    }
  }
`
