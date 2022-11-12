import { withUrqlClient } from 'next-urql'
import NavBar from '../components/NavBar'
import { usePostsQuery } from '../gql/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
    const [{ data }] = usePostsQuery()
    return (
        <div>
            <NavBar />
            <div>hello world</div>
            <br></br>
            {data ? (
                data.posts.map((p) => <div key={p.id}>{p.title}</div>)
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default withUrqlClient(createUrqlClient, {
    ssr: true,
})(Index)
