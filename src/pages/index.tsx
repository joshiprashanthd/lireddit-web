import { Box, Button, Center, Heading, Stack, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../gql/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  })
  if (!data && !fetching) return <Box>You got query failed for some reason</Box>

  return (
    <Layout>
      <Stack spacing={8}>
        {!data && fetching ? (
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

export default withUrqlClient(createUrqlClient, {
  ssr: true,
})(Index)
