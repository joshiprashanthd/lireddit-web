import { Button, ButtonProps } from '@chakra-ui/react'

type RButtonProps = ButtonProps & {
  transparentBg?: Boolean
}
export const RButton: React.FC<RButtonProps> = ({
  transparentBg,
  ...props
}) => {
  return (
    <Button
      {...props}
      borderRadius="md"
      bgColor={transparentBg ? 'transparent' : 'purple.500'}
      _hover={{
        bgColor: 'purple.500',
      }}
      _active={{
        bgColor: 'purple.700',
        transform: 'scale(0.98)',
      }}
    />
  )
}
