import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: 'http://192.168.1.123/graphql',
})

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('access_token')
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        console.log('GraphQL auth error:', err.message)
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {},
  }),
  defaultOptions,
})

export default client
