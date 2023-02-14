import { IconButtonProps, IconButton } from '@chakra-ui/react'

type RIconButtonProps = IconButtonProps & {
  transparentBg?: Boolean
}
export const RIconButton: React.FC<RIconButtonProps> = ({
  transparentBg,
  ...props
}) => {
  return (
    <IconButton
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
