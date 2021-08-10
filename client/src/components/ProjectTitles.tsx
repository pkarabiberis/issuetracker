import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface ProjectTitlesProps {}

export const ProjectTitles: React.FC<ProjectTitlesProps> = ({}) => {
  return (
    <Flex
      p={2}
      mt={4}
      bgColor={'#fbf9f8'}
      borderRadius={'lg'}
      alignItems={'center'}
      w={'100%'}
    >
      <Text flexGrow={1} flexBasis={0} fontWeight={'bold'}>
        Project
      </Text>
      <Text flexGrow={1} flexBasis={0} fontWeight={'bold'} textAlign={'center'}>
        Members
      </Text>
      <Text flexGrow={1} flexBasis={0} fontWeight={'bold'} textAlign={'end'}>
        Last updated
      </Text>
    </Flex>
  );
};
