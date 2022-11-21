import { Box, Button, Flex, Link, Spacer, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useCurrentUserQuery, useLogoutMutation } from '../gql/graphql'
import { isServer } from '../utils/isServer'

const NavBar: React.FC = ({}) => {
  const [{ data, fetching }] = useCurrentUserQuery({
    pause: isServer(), // dont fetch current user if server side rendering is there
  })
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const router = useRouter()
  let body = null

  if (fetching) {
  } else if (!data?.currentUser) {
    body = (
      <Flex w="full">
        <Spacer />
        <NextLink href="/login">
          <Link mr={4} color="white">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4} color="white">
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
        <NextLink href="/create-post">
          <Button variant="link" color="white">
            Create Post
          </Button>
        </NextLink>
        <Box ml={4}>
          <Button
            variant="link"
            color="white"
            onClick={async () => {
              const response = await logout({})
              if (response.data?.logout) router.push('/')
            }}
            isLoading={logoutFetching}
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
    </Flex>
  )
}

export default NavBar
