import { getDataFromTree } from '@apollo/client/react/ssr'
import { Box, Center, Stack } from '@chakra-ui/react'
import { RButton } from '../components/core/RButton'
import { Layout } from '../components/Layout'
import { Post } from '../components/Post'
import { usePostsQuery } from '../gql/graphql'
import withApollo from '../utils/withApollo'

const Index = () => {
  const { data, loading, fetchMore } = usePostsQuery({
    variables: {
      limit: 5,
    },
  })
  if (!data && !loading) return <Box>You got query failed for some reason</Box>

  return (
    <Layout>
      <Stack spacing={4}>
        {data && data!.posts.posts.map((p) => <Post key={p.id} post={p} />)}
      </Stack>
      {data && data.posts.hasMore && (
        <Center>
          <RButton
            mt={8}
            transparentBg
            onClick={() =>
              fetchMore({
                variables: {
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }
          >
            Load More
          </RButton>
        </Center>
      )}
    </Layout>
  )
}

export default withApollo(Index, { getDataFromTree })
