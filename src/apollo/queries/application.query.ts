import { gql } from '@apollo/client';
import { APPLICATION_FRAGMENT } from '../fragments/application.fragment';

export const APPLICATION_QUERY = gql`
${APPLICATION_FRAGMENT}
  query GetApplication {
    application {
      ...ApplicationFragment
    }
  }
`;