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
      <Heading mb={8} color="white">
        Create Post
      </Heading>
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
            <InputField
              name="title"
              label="Title"
              borderColor="gray.700"
              borderWidth="2px"
            />
            <Box mt={4}>
              <InputField name="text" label="Body" textarea />
            </Box>
            <Button
              minW="lg"
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              bg="purple.500"
              color="white"
              _hover={{
                bg: 'purple.700',
              }}
              my={8}
            >
              Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo(CreatePost)
