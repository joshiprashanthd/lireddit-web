import { Box, Button, Heading, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../gql/graphql'
import withApollo from '../utils/withApollo'

export const ForgotPassword = () => {
  const toast = useToast()
  const [forgotPassword] = useForgotPasswordMutation()
  const [complete, setComplete] = useState(false)

  return (
    <Wrapper variant="small">
      <Heading mb={8}>Forgot Password</Heading>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          const response = await forgotPassword({ variables: values })
          if (!response.data?.forgotPassword)
            toast({
              title: 'Something Went Wrong!!',
              description: 'Make sure your email is correct',
              status: 'error',
              duration: 5000,
              variant: 'left-accent',
              isClosable: true,
              position: 'bottom-right',
            })
          else if (response.data?.forgotPassword) {
            toast({
              title: 'Verification Email Sent',
              description: 'Check your email to change password',
              status: 'success',
              variant: 'left-accent',
              duration: 5000,
              position: 'bottom-right',
            })
            setComplete(true)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" label="Email" />
            <Box mt={4}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={complete}
              >
                Send Email
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withApollo()(ForgotPassword)
