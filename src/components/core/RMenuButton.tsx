import { Button, ButtonProps, MenuButton } from '@chakra-ui/react'
import { RButton } from './RButton'

type RMenuButtonProps = ButtonProps & {
  transparentBg?: boolean
  isActive: boolean
}

export const RMenuButton: React.FC<RMenuButtonProps> = ({
  isActive,
  transparentBg,
  rightIcon,
  ...props
}) => {
  return (
    <MenuButton
      {...props}
      as={Button}
      p={4}
      borderRadius="md"
      isActive
      rightIcon={rightIcon}
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
