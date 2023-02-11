import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'

import InputField from '../components/InputField'
import { Layout } from '../components/Layout'
import { PostsDocument, useCreatePostMutation } from '../gql/graphql'
import { useIsAuth } from '../utils/useIsAuth'
import withApollo from '../utils/withApollo'

const CreatePost = () => {
  const router = useRouter()
  useIsAuth()
  const [createPost] = useCreatePostMutation({
    refetchQueries: [
      {
        query: PostsDocument,
        variables: {
          limit: 5,
        },
      },
    ],
  })
  return (
    <Layout variant="small">
      <Heading mb={8}>Create Post</Heading>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const response = await createPost({ variables: { input: values } })
          if (!response.errors) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" />
            <Box mt={4}>
              <InputField name="text" label="Body" textarea />
            </Box>
            <Box mt={4}>
              <Button type="submit" isLoading={isSubmitting}>
                Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo(CreatePost)
