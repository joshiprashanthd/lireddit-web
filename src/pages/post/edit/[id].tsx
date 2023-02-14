import { gql } from '@apollo/client'
import { Box, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { RButton } from '../../../components/core/RButton'
import { RCard } from '../../../components/core/RCard'
import InputField from '../../../components/InputField'
import { Layout } from '../../../components/Layout'
import { usePostQuery, useUpdatePostMutation } from '../../../gql/graphql'
import withApollo from '../../../utils/withApollo'

const UpdatePost: React.FC = ({}) => {
  const router = useRouter()
  const postId = parseInt(router.query.id as string)
  const { data: post } = usePostQuery({ variables: { id: postId } })
  const [updatePost] = useUpdatePostMutation()
  return (
    <Layout variant="regular">
      <RCard>
        <Heading mb={8}>Edit Post</Heading>
        <Formik
          initialValues={{ title: post?.post?.title, text: post?.post?.text }}
          onSubmit={async (values) => {
            const response = await updatePost({
              variables: {
                id: postId,
                title: values.title,
                text: values.text,
              },
              update: (cache) => {
                cache.updateFragment(
                  {
                    id: cache.identify(post?.post!),
                    fragment: gql`
                      fragment _ on Post {
                        title
                        text
                      }
                    `,
                  },
                  (prevData) => ({
                    title: values.title,
                    text: values.text,
                  })
                )
              },
            })
            if (!response.errors) {
              router.replace(`/post/${postId}`)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                label="Title"
                borderColor="gray.700"
                borderWidth="2px"
              />
              <Box mt={4}>
                <InputField name="text" label="Body" textarea />
              </Box>
              <RButton
                minW="full"
                mt={4}
                type="submit"
                isLoading={isSubmitting}
              >
                Save
              </RButton>
            </Form>
          )}
        </Formik>
      </RCard>
    </Layout>
  )
}

export default withApollo(UpdatePost)
