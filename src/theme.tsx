import { extendTheme } from '@chakra-ui/react'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const theme = extendTheme({
  // components: {
  //   Text: {
  //     baseStyle: {
  //       color: 'white',
  //     },
  //   },
  //   Heading: {
  //     baseStyle: {
  //       color: 'white',
  //     },
  //   },
  // },
  styles: {
    global: {
      // styles for the `body`
      body: {
        color: 'white',
      },
    },
  },
  colors: {
    black: '#16161D',
  },
  fonts,
  breakpoints,
})

export default theme
