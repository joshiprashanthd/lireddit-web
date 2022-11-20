import { Button } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../gql/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLink from 'next/link'

const Index = () => {
    const [{ data }] = usePostsQuery()
    return (
        <Layout>
            <NextLink href="/create-post">
                <Button>Create Post</Button>
            </NextLink>
            {data ? (
                data.posts.map((p) => <div key={p.id}>{p.title}</div>)
            ) : (
                <div>Loading...</div>
            )}
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient, {
    ssr: true,
})(Index)
