import { cacheExchange } from '@urql/exchange-graphcache'
import { dedupExchange, Exchange, fetchExchange } from 'urql'
import { betterUpdateQuery } from './betterUpdateQuery'

import {
  CreatePostDocument,
  CreatePostMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  LogoutMutation,
  PostsQuery,
  RegisterMutation,
} from '../gql/graphql'
import { tap, pipe } from 'wonka'
import Router from 'next/router'

const errorExchange: Exchange =
  ({ forward }) =>
  (op$) => {
    return pipe(
      forward(op$),
      tap(({ error }) => {
        if (error?.message.includes('Not Authenticated'))
          Router.replace('/login')
      })
    )
  }

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  } as const,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _, cache, __) => {
            betterUpdateQuery<LogoutMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              () => ({ currentUser: null })
            )
          },
          login: (_result, _, cache, __) => {
            // every query saves the last fetched data
            // and whenever we query, the saved cached data is returned
            // when login mutation gets called, we have to update the currentUser query's cache data too
            // providing {query: CurrentUserDocument} tells updateQuery function to return the cached data of this query
            // as 'query' parameter in the function we are providing
            // function has two parameters, result and query
            // this function updates currentUser query's cached data by returning new cached value
            // result refers to data fetched by login mutation
            // query refers to currentUser query's previously stored cache data
            betterUpdateQuery<LoginMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                } else {
                  return {
                    currentUser: result.login.user,
                  }
                }
              }
            )
          },
          register: (_result, _, cache, __) => {
            betterUpdateQuery<RegisterMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query
                } else {
                  return {
                    currentUser: result.register.user,
                  }
                }
              }
            )
          },
          createPost: (_result, _, cache, __) => {
            betterUpdateQuery<CreatePostMutation, PostsQuery>(
              cache,
              { query: CreatePostDocument },
              _result,
              (result, query) => {
                if (typeof query.posts === 'undefined') return query
                else
                  return {
                    posts: query.posts.concat([
                      {
                        __typename: result.createPost.__typename,
                        id: result.createPost.id,
                        title: result.createPost.title,
                        createdAt: result.createPost.createdAt,
                        updatedAt: result.createPost.updatedAt,
                      },
                    ]),
                  }
              }
            )
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
})
