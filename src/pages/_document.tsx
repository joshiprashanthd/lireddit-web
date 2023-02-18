import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <title>Lireddit</title>
        <Head />
        <body>
          <ColorModeScript initialColorMode="light" type="localStorage" />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
