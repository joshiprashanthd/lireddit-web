import { getDataFromTree } from '@apollo/client/react/ssr'
import {
  Divider,
  Heading,
  HStack,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { RButton } from '../../components/core/RButton'
import { RCard } from '../../components/core/RCard'
import { Layout } from '../../components/Layout'
import { VoteSection } from '../../components/VoteSection'
import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  useCurrentUserQuery,
  useDeletePostMutation,
  usePostQuery,
} from '../../gql/graphql'
import withApollo from '../../utils/withApollo'

const Post: React.FC = () => {
  const router = useRouter()
  const toast = useToast()
  const { data: currentUser } = useCurrentUserQuery()
  const [deletePost] = useDeletePostMutation()
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id!) : -1

  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  })

  if (loading) return <Layout variant="small">loading...</Layout>

  return (
    <Layout variant="regular">
      <RCard>
        <Heading>{data?.post?.title}</Heading>
        <Text fontSize={14}>posted by @{data?.post?.creator.username}</Text>
        <Text mt={8}>{data?.post?.text}</Text>
        <Divider my={4} />
        <HStack>
          <VoteSection post={data?.post!} horizontal />
          <Spacer />
          {data?.post?.creator.id === currentUser?.currentUser?.id && (
            <HStack align="center">
              <NextLink
                href="/post/edit/[id]"
                as={`/post/edit/${data?.post!.id}`}
              >
                <RButton transparentBg>Edit</RButton>
              </NextLink>
              (
              <RButton
                transparentBg
                onClick={function () {
                  const postId = data?.post?.id!
                  deletePost({
                    variables: { id: data?.post!.id! },
                    update: (cache, { data }) => {
                      if (data?.deletePost) {
                        cache.updateQuery<PostsQuery, PostsQueryVariables>(
                          {
                            query: PostsDocument,
                            overwrite: true,
                            variables: { limit: 5, cursor: null },
                          },
                          (prevData) => {
                            if (!prevData)
                              return { posts: { posts: [], hasMore: false } }
                            else
                              return {
                                posts: {
                                  posts: prevData.posts.posts.filter(
                                    (p: { id: number }) => p.id !== postId
                                  ),
                                  hasMore: prevData?.posts.hasMore,
                                },
                              }
                          }
                        )
                      }
                    },
                    onCompleted(data, _) {
                      if (data.deletePost) router.replace('/')
                      else {
                        toast({
                          title: 'Something Went Wrong!!',
                          description: 'Make Sure your are logged in',
                          status: 'error',
                          duration: 5000,
                          variant: 'left-accent',
                          isClosable: true,
                          position: 'bottom-right',
                        })
                      }
                    },
                  })
                }}
              >
                Delete
              </RButton>
              )
            </HStack>
          )}
        </HStack>
      </RCard>
    </Layout>
  )
}

export default withApollo(Post, { getDataFromTree })
