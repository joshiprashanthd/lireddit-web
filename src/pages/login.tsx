import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import InputField from '../components/InputField'
import { Layout } from '../components/Layout'
import { useLoginMutation } from '../gql/graphql'
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
  })

  return (
    <Layout variant="small">
      <Heading mb={8} color="white">
        Login
      </Heading>
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
            <InputField name="usernameOrEmail" label="Username or Email" />
            <Box mt={4}>
              <InputField name="password" label="Password" type="password" />
              <NextLink href="forgot-password">
                <Link color="blue.600">Forgot Password</Link>
              </NextLink>
            </Box>
            <Button
              mt={4}
              minW="lg"
              type="submit"
              isLoading={isSubmitting}
              bg="purple.500"
              color="white"
              _hover={{
                bg: 'purple.700',
              }}
              my={8}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo(Login)
