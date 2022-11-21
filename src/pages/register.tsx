import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../gql/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import withApollo from '../utils/withApollo'

const Register = () => {
  const router = useRouter()
  const [register] = useRegisterMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          currentUser: (exData) => {
            if (data?.register.errors) return null
            return data?.register.user
          },
        },
      })
    },
  })

  return (
    <Wrapper variant="small">
      <Heading mb={8}>Register</Heading>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ variables: { options: values } })
          if (response.data?.register.errors)
            setErrors(toErrorMap(response.data.register.errors))
          else if (response.data?.register.user) router.push('/')
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" label="Email" type="email" />
            <Box mt={4}>
              <InputField name="username" label="Username" />
            </Box>
            <Box mt={4}>
              <InputField name="password" label="Password" type="password" />
            </Box>
            <Box mt={4}>
              <Button type="submit" isLoading={isSubmitting}>
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withApollo()(Register)
