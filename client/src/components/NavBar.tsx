import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex bgColor='white' zIndex={1} shadow={'md'} p={4} alignItems={'center'}>
      <NextLink href='/'>
        <Heading cursor={'pointer'}>IssueTracker</Heading>
      </NextLink>
      <Box ml={'auto'}>
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
      </Box>
    </Flex>
  );
};
