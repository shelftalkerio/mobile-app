import { gql } from '@apollo/client'
import { SCAN_FRAGMENT } from '@/apollo/fragments/scan.fragment'
export const QUERY_BARCODE = gql`
  ${SCAN_FRAGMENT}
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
