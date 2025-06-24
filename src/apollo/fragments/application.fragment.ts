import { gql } from '@apollo/client'

export const APPLICATION_FRAGMENT = gql`
  fragment ApplicationFragment on Application {
    name
    url
    version
    environment
    year
  }
`
