import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../gql/graphql'
import { toErrorMap } from '../utils/toErrorMap'

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}: RegisterProps) => {
    const [, register] = useRegisterMutation()

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values)
                    if (response.data?.register.errors)
                        setErrors(toErrorMap(response.data.register.errors))
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
                                Register
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register
