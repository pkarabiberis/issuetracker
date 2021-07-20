import { useApolloClient } from '@apollo/client';
import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import router from 'next/dist/client/router';
import React, { useRef } from 'react';
import { useLogoutMutation } from '../generated/graphql';
import { useOnClickOutside } from '../utils/useOnClickOutside';

interface DropdownProps {
  username?: string;
  showDropdown: boolean;
  toggle: () => void;
  iconRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  username,
  showDropdown,
  toggle,
  iconRef,
}) => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const ref = useRef<HTMLDivElement>(null);
  const apolloClient = useApolloClient();
  useOnClickOutside(ref, iconRef, toggle);
  return (
    <Box
      ref={ref}
      position={'absolute'}
      zIndex={99}
      backgroundColor={'white'}
      borderRadius={'6px'}
      border={'1px'}
      borderColor={'#e1e4e8'}
      borderStyle={'solid'}
      w={'180px'}
      left={'auto'}
      right={0}
      visibility={showDropdown ? 'visible' : 'hidden'}
    >
      <Box mt={2} ml={2}>
        <Text>Logged in as</Text>
        <Text color={'black'} fontWeight={'bold'}>
          {username}
        </Text>
      </Box>
      <Divider mt={2} orientation="horizontal" />
      <Flex direction={'column'}>
        <Button
          textColor={'black'}
          justifyContent={'flex-start'}
          mx={2}
          p={0}
          textAlign={'start'}
          bgColor={'white'}
          isLoading={logoutLoading}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
            router.replace('/login');
          }}
        >
          Logout
        </Button>
        <Button
          mx={2}
          justifyContent={'flex-start'}
          textColor={'black'}
          p={0}
          textAlign={'start'}
          bgColor={'white'}
        >
          Delete user
        </Button>
      </Flex>
    </Box>
  );
};
