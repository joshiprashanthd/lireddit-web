import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCurrentUserQuery } from '../gql/graphql'

export const useIsAuth = () => {
    const [{ data, fetching }] = useCurrentUserQuery()
    const router = useRouter()

    useEffect(() => {
        if (!fetching && !data?.currentUser)
            router.replace('/login?next=' + router.pathname)
    }, [data])
}
