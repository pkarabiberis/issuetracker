import { Icon, Box, Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { AiFillBug } from 'react-icons/ai';
import { useRouter } from 'next/dist/client/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const navToHome = () => {
    router.push('/');
  };
  return (
    <Flex bgColor="white" zIndex={1} shadow={'md'} p={4} alignItems={'center'}>
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
      <Box ml={'auto'}>
        <NextLink href="/login">
          <Button
            textColor={'white'}
            _hover={{ bgColor: 'blue.300' }}
            bgColor={'blue.400'}
            mr={2}
          >
            Login
          </Button>
        </NextLink>
        <NextLink href="/register">
          <Button
            textColor={'white'}
            _hover={{ bgColor: 'blue.300' }}
            bgColor={'blue.400'}
          >
            Register
          </Button>
        </NextLink>
      </Box>
    </Flex>
  );
};
