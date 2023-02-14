import { Box, BoxProps } from '@chakra-ui/react'

type RCardProps = BoxProps

export const RCard: React.FC<RCardProps> = (props) => {
  return (
    <Box
      {...props}
      bg="blackAlpha.600"
      borderRadius="2xl"
      borderWidth={2}
      borderColor="gray.700"
      boxShadow="lg"
      p={8}
    />
  )
}
