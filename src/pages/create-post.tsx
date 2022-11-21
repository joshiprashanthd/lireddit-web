import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'

import InputField from '../components/InputField'
import { Layout } from '../components/Layout'
import { useCreatePostMutation } from '../gql/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useIsAuth } from '../utils/useIsAuth'

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter()
  useIsAuth()
  const [, createPost] = useCreatePostMutation()
  return (
    <Layout variant="small">
      <Heading mb={8}>Create Post</Heading>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values })
          if (!error) {
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

export default withUrqlClient(createUrqlClient)(CreatePost)
