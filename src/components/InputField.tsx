import { FieldHookConfig, useField } from 'formik'
import {
  ChakraProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Text,
} from '@chakra-ui/react'

type InputFieldProps = ChakraProps &
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
      <FormLabel htmlFor={field.name}>
        <Text color="white">{label}</Text>
      </FormLabel>
      <InputOrTextarea
        {...field}
        variant="filled"
        bg="none"
        type={type}
        id={field.name}
        placeholder={placeholder}
        color="white"
        borderColor="gray.500"
        borderWidth="2px"
        p="8px"
        focusBorderColor="purple.500"
        _hover={{
          bg: 'none',
        }}
      />
      {error ?? <FormErrorMessage color="red.500">{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField
