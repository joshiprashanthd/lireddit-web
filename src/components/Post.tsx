import { Box, HStack, VStack, Heading, Text } from '@chakra-ui/react'
import { PostSnippetFragment } from '../gql/graphql'
import { VoteSection } from './VoteSection'
import NextLink from 'next/link'
import { RCard } from './core/RCard'

type PostProps = {
  post: PostSnippetFragment
}
export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <RCard>
      <HStack align="start">
        <Box mr="4">
          <VoteSection post={post} />
        </Box>
        <VStack align="start">
          <NextLink href="/post/[id]" as={`/post/${post.id}`}>
            <Heading fontSize="2xl">{post.title}</Heading>
          </NextLink>
          <Text fontSize="xs">posted by {post.creator.username}</Text>
          <Text mt={4}>{post.textSnippet}...</Text>
        </VStack>
      </HStack>
    </RCard>
  )
}
