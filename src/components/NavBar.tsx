import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Flex,
  Heading,
  HStack,
  Menu,
  MenuDivider,
  MenuList,
  Spacer,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useCurrentUserQuery, useLogoutMutation } from '../gql/graphql'
import { useIsServer } from '../utils/useIsServer'
import { RButton } from './core/RButton'
import { RMenuButton } from './core/RMenuButton'
import { RMenuItem } from './core/RMenuItem'

const NavBar: React.FC = ({}) => {
  const isServer = useIsServer()
  const { data, loading } = useCurrentUserQuery({
    skip: isServer,
  })
  const [logout, { client }] = useLogoutMutation({
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
      <HStack align="center">
        <NextLink href="/login">
          <RButton
            mr={2}
            bg="none"
            _hover={{
              bg: 'purple.500',
            }}
          >
            Login
          </RButton>
        </NextLink>
        <NextLink href="/register">
          <RButton
            mr={4}
            bg="none"
            _hover={{
              bg: 'purple.500',
            }}
          >
            Register
          </RButton>
        </NextLink>
      </HStack>
    )
  } else {
    body = (
      <HStack align="center">
        <NextLink href="/create-post">
          <RButton mr={2} transparentBg>
            Create Post
          </RButton>
        </NextLink>
        <Menu>
          {({ isOpen }) => (
            <>
              <RMenuButton
                isActive={isOpen}
                rightIcon={<ChevronDownIcon />}
                transparentBg
              >
                @{data.currentUser!.username}
              </RMenuButton>
              <MenuList
                borderRadius="md"
                bg="rgba(0, 0, 0, 0.5)"
                borderColor="gray.700"
                borderWidth={2}
                p={1}
              >
                <RMenuItem>Profile</RMenuItem>
                <MenuDivider />
                <RMenuItem>Settings</RMenuItem>
                <RMenuItem
                  onClick={async () => {
                    const response = await logout()
                    if (response.data?.logout) {
                      await client.resetStore()
                      router.push('/')
                    }
                  }}
                >
                  Log Out
                </RMenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </HStack>
    )
  }

  return (
    <Flex
      position="sticky"
      justify="space-between"
      top={4}
      p={4}
      zIndex={1}
      mx={8}
      borderRadius="2xl"
      bg="rgba(128,90,213, 0.3)"
      backdropFilter="blur(8px)"
      borderColor="gray.700"
      borderWidth="2px"
      alignItems="center"
    >
      <NextLink href="/">
        <Heading fontSize="2xl" mx="auto">
          LiReddit
        </Heading>
      </NextLink>
      <Spacer />
      {body}
    </Flex>
  )
}

export default NavBar
