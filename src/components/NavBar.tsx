import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useCurrentUserQuery, useLogoutMutation } from '../gql/graphql'
import { useIsServer } from '../utils/useIsServer'

const NavBar: React.FC = ({}) => {
  const isServer = useIsServer()
  const { data, loading } = useCurrentUserQuery({
    skip: isServer,
  })
  const [logout] = useLogoutMutation({
    update: (cache) => {
      cache.modify({
        fields: {
          currentUser: () => null,
        },
      })
    },
  })

  const router = useRouter()
  let body = null

  if (!data?.currentUser) {
    body = (
      <Flex w="full" alignItems="center">
        <Heading fontSize="2xl" mx="auto" color="white">
          LiReddit
        </Heading>
        <Spacer />
        <NextLink href="/login">
          <Button
            mr={4}
            bg="none"
            color="white"
            _hover={{
              bg: 'purple.500',
            }}
          >
            Login
          </Button>
        </NextLink>
        <NextLink href="/register">
          <Button
            mr={4}
            bg="none"
            color="white"
            _hover={{
              bg: 'purple.500',
            }}
          >
            Register
          </Button>
        </NextLink>
      </Flex>
    )
  } else {
    body = (
      <Flex w="full" alignItems="center">
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                bg="none"
                _hover={{
                  bg: 'purple.500',
                }}
                _active={{
                  bg: 'purple.500',
                }}
                color="white"
                rightIcon={<ChevronDownIcon />}
              >
                @{data.currentUser!.username}
              </MenuButton>
              <MenuList
                borderRadius={8}
                bg="rgba(0, 0, 0, 0.5)"
                boxShadow={'2xl'}
                backdropBlur="10px"
                backdropFilter="auto"
                borderColor="gray.700"
                borderWidth="2px"
                p="4px"
              >
                <MenuItem
                  borderRadius="4px"
                  bg="none"
                  color="white"
                  _hover={{
                    bg: 'purple.500',
                  }}
                >
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  borderRadius="4px"
                  color="white"
                  _hover={{
                    bg: 'purple.500',
                  }}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    const response = await logout()
                    if (response.data?.logout) router.push('/')
                  }}
                  borderRadius="4px"
                  color="white"
                  _hover={{
                    bg: 'purple.500',
                  }}
                >
                  Log Out
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
        <Spacer />
        <NextLink href="/create-post">
          <Button
            ml={8}
            bg="none"
            color="white"
            _hover={{
              bg: 'purple.500',
            }}
          >
            Create Post
          </Button>
        </NextLink>
      </Flex>
    )
  }

  return (
    <Box
      position="sticky"
      top={4}
      p={4}
      zIndex={1}
      mx={8}
      borderRadius={16}
      bg="rgba(0, 0, 0, 0.3)"
      boxShadow={'2xl'}
      backdropFilter="blur(10px)"
      borderColor="gray.700"
      borderWidth="2px"
    >
      {body}
    </Box>
  )
}

export default NavBar
