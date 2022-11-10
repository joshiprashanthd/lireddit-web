import { Box, Button, Heading } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useLoginMutation } from '../gql/graphql'
import { toErrorMap } from '../utils/toErrorMap'

const Login: React.FC<{}> = ({}) => {
    const router = useRouter()
    const [, register] = useLoginMutation()

    return (
        <Wrapper variant="small">
            <Heading mb={8}>Login</Heading>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ options: values })
                    if (response.data?.login.errors)
                        setErrors(toErrorMap(response.data.login.errors))
                    else if (response.data?.login.user) router.push('/')
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" label="Username" />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Box mt={4}>
                            <Button type="submit" isLoading={isSubmitting}>
                                Login
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Login
