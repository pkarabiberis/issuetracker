import { Icon, Box, Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { AiFillBug } from 'react-icons/ai';
import { useRouter } from 'next/dist/client/router';
import { useCurrentUserQuery, useLogoutMutation } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const navToHome = () => {
    router.push('/');
  };
  const apolloClient = useApolloClient();
  const { data, loading } = useCurrentUserQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  let navBarButtons;

  if (loading) {
  }
  if (!data?.currentUser) {
    navBarButtons = (
      <>
        <NextLink href='/login'>
          <Button
            textColor={'white'}
            _hover={{ bgColor: 'blue.300' }}
            bgColor={'blue.400'}
            mr={2}
          >
            Login
          </Button>
        </NextLink>
        <NextLink href='/register'>
          <Button
            textColor={'white'}
            _hover={{ bgColor: 'blue.300' }}
            bgColor={'blue.400'}
          >
            Register
          </Button>
        </NextLink>
      </>
    );
  }

  if (data?.currentUser) {
    navBarButtons = (
      <>
        <Button
          textColor={'white'}
          _hover={{ bgColor: 'blue.300' }}
          bgColor={'blue.400'}
          mr={2}
        >
          {data.currentUser.username}
        </Button>

        <Button
          textColor={'white'}
          _hover={{ bgColor: 'blue.300' }}
          bgColor={'blue.400'}
          isLoading={logoutLoading}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
        >
          Logout
        </Button>
      </>
    );
  }
  return (
    <Flex bgColor='white' zIndex={1} shadow={'md'} p={4} alignItems={'center'}>
      <Flex alignItems={'center'}>
        <Icon
          boxSize={10}
          color={'black'}
          _hover={{ color: 'blackAlpha.700' }}
          cursor={'pointer'}
          as={AiFillBug}
          onClick={() => navToHome()}
        />

        <Heading ml={4}>IssueTracker</Heading>
      </Flex>
      <Box ml={'auto'}>{navBarButtons}</Box>
    </Flex>
  );
};
