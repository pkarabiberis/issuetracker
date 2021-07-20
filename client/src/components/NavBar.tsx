import { Box, Button, Flex, Heading, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { useRef } from 'react';

import { AiFillBug } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { useCurrentUserQuery } from '../generated/graphql';

import { Dropdown } from './Dropdown';

export const NavBar: React.FC = ({}) => {
  const router = useRouter();
  const { data, loading } = useCurrentUserQuery();
  const [showDropdown, setShowDropdown] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  let navBarButtons;

  const testToggle = () => {
    setShowDropdown(false);
  };

  if (loading) {
  }
  if (!data?.currentUser) {
    navBarButtons = (
      <>
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
      </>
    );
  }

  if (data?.currentUser) {
    navBarButtons = (
      <>
        <Box position={'relative'} display={'inline-block'}>
          <Box ref={iconRef}>
            <Icon
              backgroundColor={'white'}
              boxSize={6}
              as={FaUserCircle}
              onClick={() => {
                setShowDropdown((dropdown) => !dropdown);
              }}
            />
          </Box>
          <Dropdown
            username={data.currentUser.username}
            showDropdown={showDropdown}
            toggle={testToggle}
            iconRef={iconRef}
          />
        </Box>
      </>
    );
  }
  return (
    <Flex
      bgColor="white"
      maxW={'1200px'}
      mx={'auto'}
      mt={4}
      alignItems={'center'}
    >
      <NextLink href="/">
        <Flex alignItems={'center'}>
          <Icon
            boxSize={10}
            color={'black'}
            _hover={{ color: 'blackAlpha.700' }}
            cursor={'pointer'}
            as={AiFillBug}
            onClick={() => {
              router.push('/');
            }}
          />

          <Heading
            visibility={{
              base: 'hidden',
              sm: 'hidden',
              md: 'visible',
              lg: 'visible',
              xl: 'visible',
            }}
            cursor={'pointer'}
            ml={4}
          >
            Issuetracker
          </Heading>
        </Flex>
      </NextLink>

      <Box ml={'auto'}>{navBarButtons}</Box>
    </Flex>
  );
};
