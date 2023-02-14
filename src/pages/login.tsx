import { Box, Heading, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { RButton } from '../components/core/RButton'
import { RCard } from '../components/core/RCard'

import InputField from '../components/InputField'
import { Layout } from '../components/Layout'
import { PostsDocument, useLoginMutation } from '../gql/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import withApollo from '../utils/withApollo'

const Login = () => {
  const router = useRouter()
  const [login] = useLoginMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          currentUser: (exData) => {
            if (data?.login.errors) return null
            return data?.login.user
          },
        },
      })
    },
    refetchQueries: [
      {
        query: PostsDocument,
        variables: {
          limit: 10,
          cursor: null,
        },
      },
    ],
  })

  return (
    <Layout variant="small">
      <RCard>
        <Heading mb={8}>Login</Heading>
        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({ variables: values })
            if (response.data?.login.errors)
              setErrors(toErrorMap(response.data.login.errors))
            else if (response.data?.login.user) {
              if (typeof router.query.next === 'string')
                router.replace(router.query.next)
              else router.replace('/')
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* //TODO: when username is not found, still it shows "username already taken" */}
              <InputField name="usernameOrEmail" label="Username or Email" />
              <Box mt={4}>
                <InputField name="password" label="Password" type="password" />
                <NextLink href="forgot-password">
                  <Link as="div" color="purple.300">
                    Forgot Password
                  </Link>
                </NextLink>
              </Box>
              <RButton
                isLoading={isSubmitting}
                minW="full"
                type="submit"
                mt={4}
              >
                Login
              </RButton>
            </Form>
          )}
        </Formik>
      </RCard>
    </Layout>
  )
}

export default withApollo(Login)
