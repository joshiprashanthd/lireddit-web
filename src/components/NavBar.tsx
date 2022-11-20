import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Router, useRouter } from 'next/router'
import { useCurrentUserQuery, useLogoutMutation } from '../gql/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching, error }, refetch] = useCurrentUserQuery({
        pause: isServer(), // dont fetch current user if server side rendering is there
    })
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    const router = useRouter()
    let body = null

    if (fetching) {
    } else if (!data?.currentUser) {
        body = (
            <>
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
            </>
        )
    } else {
        body = (
            <Flex>
                <Text fontSize="md" color="white" mr={4}>
                    {data.currentUser.username}
                </Text>
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
            </Flex>
        )
    }

    return (
        <Flex position="sticky" top={0} bg="darkslategrey" p={4} zIndex={1}>
            <Box ml="auto">{body}</Box>
        </Flex>
    )
}

export default NavBar
