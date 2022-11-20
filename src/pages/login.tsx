import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useLoginMutation } from '../gql/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

const Login: React.FC<{}> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()

  return (
    <Wrapper variant="small">
      <Heading mb={8}>Login</Heading>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values)
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
            </Box>
            <Box mt={4}>
              <Flex align="center" justify="space-between">
                <Button type="submit" isLoading={isSubmitting}>
                  Login
                </Button>
                <NextLink href="forgot-password">
                  <Link color="blue.600">Forgot Password</Link>
                </NextLink>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login)
