import { Box } from '@chakra-ui/react'

export type WrapperVariant = 'small' | 'regular'

interface WrapperProps {
  children: any
  variant?: WrapperVariant
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => (
  <Box maxW={variant === 'regular' ? '3xl' : 'lg'} mx="auto" mt="8" w="100%">
    {children}
  </Box>
)
