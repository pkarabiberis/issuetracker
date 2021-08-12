import { Flex } from '@chakra-ui/layout';
import React from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction={'column'} h={'100%'} w={'100%'}>
      <NavBar />
      <Flex grow={1} justifyContent='center' alignItems='center' mx='auto'>
        {children}
      </Flex>
    </Flex>
  );
};
