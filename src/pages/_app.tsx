import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache'
import {
    CurrentUserDocument,
    CurrentUserQuery,
    LoginMutation,
    LogoutMutation,
    RegisterMutation,
} from '../gql/graphql'

function betterUpdateQuery<R, Q>(
    cache: Cache,
    input: QueryInput,
    result: any,
    fn: (r: R, q: Q) => Q
) {
    return cache.updateQuery(input, (data) => fn(result, data as any) as any)
}

const client = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include',
    },
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
        fetchExchange,
    ],
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider value={client}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    )
}

export default MyApp
