import { Box, Heading, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { RButton } from '../components/core/RButton'
import { RCard } from '../components/core/RCard'
import InputField from '../components/InputField'
import { Layout } from '../components/Layout'
import { useForgotPasswordMutation } from '../gql/graphql'
import withApollo from '../utils/withApollo'

export const ForgotPassword = () => {
  const toast = useToast()
  const [forgotPassword] = useForgotPasswordMutation()
  const [complete, setComplete] = useState(false)

  return (
    <Layout variant="small">
      <RCard>
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
                <RButton
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={complete}
                >
                  Send Email
                </RButton>
              </Box>
            </Form>
          )}
        </Formik>
      </RCard>
    </Layout>
  )
}

export default withApollo(ForgotPassword)
