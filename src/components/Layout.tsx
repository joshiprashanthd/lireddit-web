import NavBar from './NavBar'
import { Wrapper, WrapperVariant } from './Wrapper'
import React from 'react'
import { Box } from '@chakra-ui/react'

interface LayoutProps {
  children: any
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <Box bgColor="blackAlpha.800" minH="100vh">
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Box>
  )
}
