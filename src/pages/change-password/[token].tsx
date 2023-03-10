import { Flex, Heading, Link, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RButton } from '../../components/core/RButton'
import { RCard } from '../../components/core/RCard'

import InputField from '../../components/InputField'
import { Layout } from '../../components/Layout'
import { useChangePasswordMutation } from '../../gql/graphql'
import { toErrorMap } from '../../utils/toErrorMap'
import withApollo from '../../utils/withApollo'

const ChangePassword = () => {
  const toast = useToast()
  const router = useRouter()
  const [changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState<string | null>(null)

  useEffect(() => {
    if (tokenError && tokenError.length > 0) {
      toast({
        title: tokenError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setTokenError('')
    }
  }, [tokenError])

  return (
    <Layout variant="small">
      <RCard>
        <Heading mb={8}>Change Password</Heading>
        <Formik
          initialValues={{ newPassword: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              variables: {
                ...values,
                token:
                  typeof router.query.token === 'string'
                    ? router.query.token
                    : '',
              },
            })
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors)

              if ('token' in errorMap) {
                setTokenError(errorMap['token'])
              } else {
                setErrors(errorMap)
              }
            } else if (response.data?.changePassword.user) router.push('/')
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                label="New Password"
                type="password"
              />
              <Flex align="center" justify="space-between" mt={4}>
                <RButton type="submit" isLoading={isSubmitting}>
                  Update
                </RButton>
                {tokenError != null ? (
                  <NextLink href="/forgot-password">
                    <Link color="red.600">Retry Forgot Password</Link>
                  </NextLink>
                ) : null}
              </Flex>
            </Form>
          )}
        </Formik>
      </RCard>
    </Layout>
  )
}

export default withApollo(ChangePassword)
