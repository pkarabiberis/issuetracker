import { Box, Button, Flex, Text, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { useRef } from 'react';
import { AiFillBug } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { useCurrentUserQuery } from '../generated/graphql';
import { useModalSize } from '../utils/useModalSize';
import { Dropdown } from './Dropdown';
import { PrimaryButton } from './PrimaryButton';

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
      <Flex ml={'auto'}>
        <NextLink href='/login'>
          <a>
            <PrimaryButton mr={2} buttonText={'Login'} />
          </a>
        </NextLink>
        <NextLink href='/register'>
          <a>
            <PrimaryButton buttonText={'Register'} />
          </a>
        </NextLink>
      </Flex>
    );
  }

  if (data?.currentUser) {
    navBarButtons = (
      <>
        <Box position={'relative'} display={'inline-block'}>
          <Box ref={iconRef}>
            <Icon
              backgroundColor={'white'}
              color={'#361d32'}
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
    <Box w={'100%'} p={4} shadow={'sm'}>
      <Flex maxW={'1200px'} mx={'auto'} alignItems={'center'}>
        <NextLink href='/'>
          <Box>
            <Icon
              boxSize={10}
              color={'#361d32'}
              _hover={{ color: '#c7c7b7' }}
              cursor={'pointer'}
              as={AiFillBug}
              onClick={() => {
                router.push('/');
              }}
            />
          </Box>
        </NextLink>
        {data?.currentUser ? (
          <>
            <NextLink href='/projects'>
              <Text
                cursor={'pointer'}
                _hover={{ borderBottom: '1px solid', borderColor: '#361d32' }}
                ml={[4, 4, 8, 8, 8, 8]}
                color={'#361d32'}
                fontSize={24}
              >
                My projects
              </Text>
            </NextLink>
            <NextLink href='/'>
              <Text
                cursor={'pointer'}
                _hover={{ borderBottom: '1px solid', borderColor: '#361d32' }}
                ml={4}
                color={'#361d32'}
                display={['none', 'none', 'block', 'block', 'block', 'block']}
                fontSize={[16, 16, 24, 24, 24, 24]}
              >
                Explore projects
              </Text>
            </NextLink>
          </>
        ) : null}

        <Flex ml={'auto'}>{navBarButtons}</Flex>
      </Flex>
    </Box>
  );
};
