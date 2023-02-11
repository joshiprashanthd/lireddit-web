import { Box, Button, Flex, Link, Spacer, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useCurrentUserQuery, useLogoutMutation } from '../gql/graphql'
import { useIsServer } from '../utils/useIsServer'

const NavBar: React.FC = ({}) => {
  const isServer = useIsServer()
  const { data, loading } = useCurrentUserQuery({
    skip: isServer,
  })
  const [logout, { loading: logoutLoading }] = useLogoutMutation({
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

  if (loading) {
  } else if (!data?.currentUser) {
    body = (
      <Flex w="full">
        <Spacer />
        <NextLink href="/login">
          <Link mr={4} color="white" as="div">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4} color="white" as="div">
            Register
          </Link>
        </NextLink>
      </Flex>
    )
  } else {
    body = (
      <Flex w="full">
        <Text fontSize="md" color="white" mr={4}>
          {data.currentUser.username}
        </Text>
        <Spacer />

        <Box ml={4}>
          <Button
            variant="link"
            color="white"
            onClick={async () => {
              const response = await logout()
              if (response.data?.logout) router.push('/')
            }}
            isLoading={logoutLoading}
          >
            Log Out
          </Button>
        </Box>
      </Flex>
    )
  }

  return (
    <Flex position="sticky" top={0} bg="grey" p={4} zIndex={1}>
      {body}
      <NextLink href="/create-post">
        <Button variant="link" color="white" ml={8}>
          Create Post
        </Button>
      </NextLink>
    </Flex>
  )
}

export default NavBar
