import { FieldHookConfig, useField } from 'formik'
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from '@chakra-ui/react'

type InputFieldProps = FieldHookConfig<any> & {
    label: string
    placeholder?: string
}

const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, { error }] = useField(props)

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <Input
                {...field}
                type={props.type}
                id={field.name}
                placeholder={props.placeholder}
            />
            {error ?? <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    )
}

export default InputField
