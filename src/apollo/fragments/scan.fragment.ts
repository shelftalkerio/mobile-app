import { gql } from '@apollo/client'

export const SCAN_FRAGMENT = gql`
  fragment ScanFragment on Scan {
    code
    type
    valid
    associated
    message
  }
`
