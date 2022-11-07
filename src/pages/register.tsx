import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Spacer,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}: RegisterProps) => (
    <Wrapper variant="small">
        <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={(values) => {
                console.log(values)
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

export default Register
