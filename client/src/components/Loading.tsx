import { Flex } from '@chakra-ui/react';
import React from 'react';
import { NavBar } from './NavBar';

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = ({}) => {
  return (
    <>
      <NavBar />
      <Flex
        mt={10}
        maxW={'1200px'}
        align="center"
        mx={'auto'}
        direction={'column'}
      >
        Loading...
      </Flex>
    </>
  );
};
