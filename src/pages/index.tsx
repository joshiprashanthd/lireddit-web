import { getDataFromTree } from '@apollo/client/react/ssr'
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { VoteSection } from '../components/VoteSection'
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
      <Stack spacing={8}>
        {data &&
          data!.posts.posts.map((p) => {
            return (
              <Box
                key={p.id}
                p={4}
                borderRadius="lg"
                boxShadow="lg"
                borderColor="gray.500"
                borderWidth="2px"
              >
                <HStack align="start">
                  <Box mr="4">
                    <VoteSection post={p} />
                  </Box>
                  <VStack align="start">
                    <Heading fontSize="lg" color="white">
                      {p.title}
                    </Heading>
                    <Text color="white" fontSize="xs">
                      posted by {p.creator.username}
                    </Text>
                    <Text mt={4} color="white">
                      {p.textSnippet}...
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )
          })}
      </Stack>
      {data && data.posts.hasMore && (
        <Center>
          <Button
            bg="purple.500"
            color="white"
            _hover={{
              bg: 'purple.700',
            }}
            my={8}
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
          </Button>
        </Center>
      )}
    </Layout>
  )
}

export default withApollo(Index, { getDataFromTree })
