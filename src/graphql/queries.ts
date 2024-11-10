import { gql } from '@apollo/client';

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    search(query: $query, type: USER, first: 5) {
      edges {
        node {
          ... on User {
            id
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

export const GET_USER_REPOS = gql`
  query GetUserRepos($username: String!, $first: Int!, $after: String) {
    user(login: $username) {
      repositories(first: $first, after: $after, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          id
          name
          description
          stargazerCount
          watchers {
            totalCount
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
  }
`;

export const GET_REPO_ISSUES = gql`
  query GetRepoIssues($owner: String!, $name: String!, $first: Int!, $after: String) {
    repository(owner: $owner, name: $name) {
      id
      issues(
        first: $first
        after: $after
        states: OPEN
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          number
          title
          body
          createdAt
          author {
            login
          }
        }
      }
    }
  }
`;
