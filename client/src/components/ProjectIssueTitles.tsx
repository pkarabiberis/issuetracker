import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

interface ProjectIssueTitlesProps {}

export const ProjectIssueTitles: React.FC<ProjectIssueTitlesProps> = ({}) => {
  return (
    <Flex p={2} mt={4} bgColor={'gray.50'} alignItems={'center'} w={'100%'}>
      <Text
        flexGrow={1}
        flexBasis={0}
        textColor={'gray.500'}
        fontWeight={'bold'}
        textAlign={'center'}
      >
        Issue
      </Text>
      <Text
        flexGrow={1}
        flexBasis={0}
        textColor={'gray.500'}
        fontWeight={'bold'}
        textAlign={'center'}
      >
        Status
      </Text>
      <Text
        flexGrow={1}
        flexBasis={0}
        textColor={'gray.500'}
        fontWeight={'bold'}
        textAlign={'center'}
      >
        Created
      </Text>
      <Text
        flexGrow={1}
        flexBasis={0}
        textColor={'gray.500'}
        fontWeight={'bold'}
        textAlign={'center'}
      >
        Due
      </Text>
      <Text
        flexGrow={1}
        flexBasis={0}
        textColor={'gray.500'}
        fontWeight={'bold'}
        textAlign={'center'}
      >
        Assigned
      </Text>
      <Box flexGrow={0.1} flexBasis={0}></Box>
    </Flex>
  );
};
