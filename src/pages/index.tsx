import { Box, Button, Center, Heading, Stack, Text } from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../gql/graphql'
import withApollo from '../utils/withApollo'

const Index = () => {
  const { data, loading } = usePostsQuery({
    variables: {
      limit: 5,
    },
  })
  if (!data && !loading) return <Box>You got query failed for some reason</Box>

  return (
    <Layout>
      <Stack spacing={8}>
        {!data && loading ? (
          <div>Loading...</div>
        ) : (
          data!.posts.map((p) => {
            return (
              <Box key={p.id} p={4} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="lg">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}...</Text>
              </Box>
            )
          })
        )}
      </Stack>
      {data && (
        <Center>
          <Button my={8}>Load More</Button>
        </Center>
      )}
    </Layout>
  )
}

export default withApollo({ ssr: true })(Index)
