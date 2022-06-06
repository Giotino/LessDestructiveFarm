import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import fetch from 'isomorphic-unfetch';

export const queries = {
  GET_ALL_DATA: gql`
    query GetFlags(
      $offset: Int = 0
      $limit: Int = 30
      $flag: String
      $sploit: String
      $team: String
      $since: DateTime
      $until: DateTime
      $status: String
      $checksystem_response: String
    ) {
      getFlags(
        offset: $offset
        limit: $limit
        flag: $flag
        sploit: $sploit
        team: $team
        since: $since
        until: $until
        status: $status
        checksystem_response: $checksystem_response
      ) {
        flag
        sploit
        team
        timestamp
        status
        checksystem_response
      }
      getFlagCount(
        flag: $flag
        sploit: $sploit
        team: $team
        since: $since
        until: $until
        status: $status
        checksystem_response: $checksystem_response
      )
      getSearchValues {
        sploits
        teams
        statuses
      }
      getGameInfo {
        flagFormat
      }
    }
  `,
  POST_FLAGS: gql`
    mutation PostFlags($flags: [String!]!) {
      postFlags(flags: $flags)
    }
  `
};

const token = '1';

let uri: string;
if (typeof window !== 'undefined') {
  uri =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '') +
    '/api/graphql';
} else {
  uri = 'http://127.0.0.1:3000/api/graphql';
}

export const apolloClient = new ApolloClient({
  ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
  link: new HttpLink({
    uri,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    fetch
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
});
