import { useEffect, useState } from 'react'

export const useIsServer = () => {
  console.log('graphql server: ', process.env.GRAPHQL_SERVER)
  const [isServer, setIsServer] = useState(true)

  useEffect(() => {
    setIsServer(false)
  }, [])

  return isServer
}
