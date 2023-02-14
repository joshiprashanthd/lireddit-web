import { ApolloCache, gql } from '@apollo/client'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { IconButton, Stack, Text } from '@chakra-ui/react'
import { PostSnippetFragment, useVoteMutation } from '../gql/graphql'
import { RIconButton } from './core/RIconButton'

interface VoteSectionProps {
  post: Omit<PostSnippetFragment, 'textSnippet'>
  horizontal?: boolean
}

export const VoteSection: React.FC<VoteSectionProps> = ({
  post,
  horizontal,
}) => {
  const [vote] = useVoteMutation()
  return (
    <Stack direction={horizontal ? 'row' : 'column'} align="center">
      <RIconButton
        size="sm"
        aria-label="upvote"
        icon={<ChevronUpIcon />}
        transparentBg={post.voteStatus !== 1}
        variant={post.voteStatus !== 1 ? 'outline' : undefined}
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
      <Text>{post.points}</Text>
      <RIconButton
        size="sm"
        aria-label="downvote"
        icon={<ChevronDownIcon />}
        transparentBg={post.voteStatus !== -1}
        variant={post.voteStatus !== -1 ? 'outline' : undefined}
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
    </Stack>
  )
}

const updatePointsInCache = (
  cache: ApolloCache<any>,
  post: VoteSectionProps['post'],
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
