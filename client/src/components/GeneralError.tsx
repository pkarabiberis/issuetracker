import { Flex } from '@chakra-ui/react';
import React from 'react';
import { NavBar } from './NavBar';

interface GeneralErrorProps {}

export const GeneralError: React.FC<GeneralErrorProps> = ({}) => {
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
        An error occured
      </Flex>
    </>
  );
};
