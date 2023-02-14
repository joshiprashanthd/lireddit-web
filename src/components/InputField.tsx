import { FieldHookConfig, useField } from 'formik'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Text,
  InputProps,
  TextareaProps,
} from '@chakra-ui/react'

type InputFieldProps = InputProps &
  TextareaProps &
  FieldHookConfig<any> & {
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
        variant="filled"
        bg="none"
        type={type}
        id={field.name}
        placeholder={placeholder}
        borderColor="gray.500"
        borderWidth={2}
        p={2}
        focusBorderColor="purple.500"
        _hover={{
          bgColor: 'none',
        }}
      />
      {error ?? <FormErrorMessage color="red.300">{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField
