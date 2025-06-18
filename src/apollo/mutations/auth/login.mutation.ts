// src/graphql/mutations/auth/login.ts
import { gql } from '@apollo/client';
import { USER_FRAGMENT } from './../../fragments/user.fragment';

export const LOGIN_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation login($input: LoginInput) {
    login(input: $input) {
      access_token
      refresh_token
      expires_in
      token_type
      user {
        ...UserFragment
      }
    }
  }
`;