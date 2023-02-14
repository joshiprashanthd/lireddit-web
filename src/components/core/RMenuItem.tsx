import { MenuItem, MenuItemProps } from '@chakra-ui/react'

type RMenuItemProps = MenuItemProps

export const RMenuItem: React.FC<RMenuItemProps> = (props) => {
  return (
    <MenuItem
      {...props}
      borderRadius="sm"
      _hover={{
        bg: 'purple.500',
      }}
    />
  )
}
