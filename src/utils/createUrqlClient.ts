import { cacheExchange } from '@urql/exchange-graphcache'
import { dedupExchange, fetchExchange } from 'urql'
import { betterUpdateQuery } from './betterUpdateQuery'

import {
    CurrentUserDocument,
    CurrentUserQuery,
    LoginMutation,
    LogoutMutation,
    RegisterMutation,
} from '../gql/graphql'

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
                },
            },
        }),
        ssrExchange,
        fetchExchange,
    ],
})
