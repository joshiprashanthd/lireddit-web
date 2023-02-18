import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  Reference,
} from '@apollo/client'
import { withApollo } from 'next-with-apollo'

import { ApolloProvider } from '@apollo/client'
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common'

const offsetFromCursor = (
  items: Reference[],
  fieldName: string,
  cursor: string,
  readField: ReadFieldFunction
) => {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]
    if (readField(fieldName, item) === cursor) {
      return i + 1
    }
  }
  return -1
}

export default withApollo(
  ({ initialState, ctx }) => {
    let cookie

    if (typeof window === 'undefined') cookie = ctx?.req?.headers.cookie

    console.log('headers: ', ctx?.req?.headers)

    return new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: 'https://lireddit-prod-backend1.onrender.com/graphql',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          cookie,
        },
      }),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              posts: {
                keyArgs: false,
                merge: (existing, incoming, { args, readField }) => {
                  const merged = existing?.posts ? existing.posts.slice(0) : []

                  let offset = offsetFromCursor(
                    merged,
                    'createdAt',
                    args?.cursor,
                    readField
                  )

                  // If we couldn't find the cursor, default to appending to
                  // the end of the list, so we don't lose any data.
                  if (offset < 0) offset = merged.length
                  // Now that we have a reliable offset, the rest of this logic
                  // is the same as in offsetLimitPagination.
                  for (let i = 0; i < incoming.posts.length; ++i)
                    merged[offset + i] = incoming.posts[i]

                  return {
                    posts: merged,
                    hasMore: incoming.hasMore,
                  }
                },
              },
            },
          },
        },
      }).restore(initialState || {}),
    })
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      )
    },
  }
)
