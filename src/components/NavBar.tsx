import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useCurrentUserQuery, useLogoutMutation } from '../gql/graphql'

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching, error }, refetch] = useCurrentUserQuery()
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
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
                    onClick={() => logout({})}
                    isLoading={logoutFetching}
                >
                    Log Out
                </Button>
            </Flex>
        )
    }

    return (
        <Flex p={4} bg="darkslategrey">
            <Box ml="auto">{body}</Box>
        </Flex>
    )
}

export default NavBar
