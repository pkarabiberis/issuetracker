import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

interface ProjectIssueTitlesProps {
  handleSort: (arg0: string, arg1: string) => void;
}

export const ProjectIssueTitles: React.FC<ProjectIssueTitlesProps> = ({
  handleSort,
}) => {
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
      <Flex flexGrow={1} flexBasis={0} align={'center'} justify={'center'}>
        <Text
          flex={0.3}
          textColor={'gray.500'}
          fontWeight={'bold'}
          textAlign={'center'}
        >
          Status
        </Text>
        <Flex direction={'column'}>
          <IconButton
            size={'xs'}
            bgColor={'gray.50'}
            aria-label='Sort by status'
            onClick={() => handleSort('status', 'ASC')}
            icon={<FaSortUp />}
          />
          <IconButton
            size={'xs'}
            bgColor={'gray.50'}
            aria-label='Sort by status'
            onClick={() => handleSort('status', 'DESC')}
            icon={<FaSortDown />}
          />
        </Flex>
      </Flex>
      <Flex flexGrow={1} flexBasis={0} align={'center'} justify={'center'}>
        <Text
          flex={0.4}
          textColor={'gray.500'}
          fontWeight={'bold'}
          textAlign={'center'}
        >
          Created
        </Text>
        <Flex direction={'column'}>
          <IconButton
            size={'xs'}
            bgColor={'gray.50'}
            aria-label='Sort by status'
            onClick={() => handleSort('createdAt', 'DESC')}
            icon={<FaSortUp />}
          />
          <IconButton
            size={'xs'}
            bgColor={'gray.50'}
            aria-label='Sort by status'
            onClick={() => handleSort('createdAt', 'ASC')}
            icon={<FaSortDown />}
          />
        </Flex>
      </Flex>

      <Flex flexGrow={1} flexBasis={0} align={'center'} justify={'center'}>
        <Text
          flex={0.3}
          textColor={'gray.500'}
          fontWeight={'bold'}
          textAlign={'center'}
        >
          Due
        </Text>
        <Flex direction={'column'}>
          <IconButton
            size={'xs'}
            bgColor={'gray.50'}
            aria-label='Sort by status'
            onClick={() => handleSort('due', 'DESC')}
            icon={<FaSortUp />}
          />
          <IconButton
            size={'xs'}
            bgColor={'gray.50'}
            aria-label='Sort by status'
            onClick={() => handleSort('due', 'ASC')}
            icon={<FaSortDown />}
          />
        </Flex>
      </Flex>

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
