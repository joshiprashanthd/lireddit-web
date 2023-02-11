import { ApolloCache, gql } from '@apollo/client'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text, VStack } from '@chakra-ui/react'
import { PostSnippetFragment, useVoteMutation } from '../gql/graphql'

interface VoteSectionProps {
  post: PostSnippetFragment
}

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [vote] = useVoteMutation()
  return (
    <VStack>
      <IconButton
        size={'xs'}
        aria-label="upvote"
        icon={<ChevronUpIcon />}
        bgColor={post.voteStatus === 1 ? 'green' : undefined}
        variant={post.voteStatus !== 1 ? 'outline' : undefined}
        color={post.voteStatus === 1 ? 'white' : undefined}
        onClick={() =>
          vote({
            variables: {
              value: 1,
              postId: post.id,
            },
            update(cache, { data }) {
              if (data)
                updatePointsInCache(
                  cache,
                  post,
                  data.vote!,
                  post.voteStatus !== 1 ? 1 : 0
                )
            },
          })
        }
      />
      <Box>{post.points}</Box>
      <IconButton
        size={'xs'}
        aria-label="downvote"
        icon={<ChevronDownIcon />}
        bgColor={post.voteStatus === -1 ? 'red' : undefined}
        variant={post.voteStatus !== -1 ? 'outline' : undefined}
        color={post.voteStatus === -1 ? 'white' : undefined}
        onClick={() =>
          vote({
            variables: {
              value: -1,
              postId: post.id,
            },
            update(cache, { data }) {
              if (data)
                updatePointsInCache(
                  cache,
                  post,
                  data.vote!,
                  post.voteStatus !== -1 ? -1 : 0
                )
            },
          })
        }
      />
    </VStack>
  )
}

const updatePointsInCache = (
  cache: ApolloCache<any>,
  post: PostSnippetFragment,
  points: number,
  voteStatus: number
) => {
  const POINTS_FRAGMENT = gql`
    fragment PointsFragment on Post {
      points
      voteStatus
    }
  `

  cache.updateFragment<{ points: number }, any>(
    {
      id: cache.identify(post),
      fragment: POINTS_FRAGMENT,
    },
    (data) => ({
      ...data,
      id: post.id,
      points,
      voteStatus,
    })
  )
}
