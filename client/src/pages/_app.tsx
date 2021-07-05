import { ChakraProvider } from '@chakra-ui/react';

import theme from '../theme';
import { AppProps } from 'next/app';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
