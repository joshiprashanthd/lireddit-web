import { FieldHookConfig, useField } from 'formik'
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Textarea,
} from '@chakra-ui/react'

type InputFieldProps = FieldHookConfig<any> & {
    label: string
    placeholder?: string
    textarea?: boolean
}

const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, { error }] = useField(props)
    const { label, textarea, placeholder, type } = props

    let InputOrTextarea: any = Input
    if (textarea) InputOrTextarea = Textarea

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea
                {...field}
                type={type}
                id={field.name}
                placeholder={placeholder}
            />
            {error ?? <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    )
}

export default InputField
