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
    <Flex
      p={2}
      mt={4}
      bgColor={'#f1e8e6'}
      borderRadius={'lg'}
      alignItems={'center'}
      w={'100%'}
    >
      <Text flexGrow={1} flexBasis={0} fontWeight={'700'} textAlign={'center'}>
        Issue
      </Text>
      <Flex flexGrow={1} flexBasis={0} align={'center'} justify={'center'}>
        <Text flex={0.3} fontWeight={'700'} textAlign={'center'}>
          Status
        </Text>
        <Flex direction={'column'}>
          <IconButton
            size={'xs'}
            bgColor={'#f1e8e6'}
            aria-label="Sort by status"
            onClick={() => handleSort('status', 'ASC')}
            _hover={{ bgColor: undefined }}
            icon={<FaSortUp />}
          />
          <IconButton
            size={'xs'}
            bgColor={'#f1e8e6'}
            aria-label="Sort by status"
            _hover={{ bgColor: undefined }}
            onClick={() => handleSort('status', 'DESC')}
            icon={<FaSortDown />}
          />
        </Flex>
      </Flex>
      <Flex flexGrow={1} flexBasis={0} align={'center'} justify={'center'}>
        <Text flex={0.4} fontWeight={'700'} textAlign={'center'}>
          Created
        </Text>
        <Flex direction={'column'}>
          <IconButton
            size={'xs'}
            bgColor={'#f1e8e6'}
            aria-label="Sort by created date"
            _hover={{ bgColor: undefined }}
            onClick={() => handleSort('createdAt', 'DESC')}
            icon={<FaSortUp />}
          />
          <IconButton
            size={'xs'}
            bgColor={'#f1e8e6'}
            aria-label="Sort by created date"
            _hover={{ bgColor: undefined }}
            onClick={() => handleSort('createdAt', 'ASC')}
            icon={<FaSortDown />}
          />
        </Flex>
      </Flex>

      <Flex flexGrow={1} flexBasis={0} align={'center'} justify={'center'}>
        <Text flex={0.3} fontWeight={'700'} textAlign={'center'}>
          Due
        </Text>
        <Flex direction={'column'}>
          <IconButton
            size={'xs'}
            bgColor={'#f1e8e6'}
            aria-label="Sort by due date"
            _hover={{ bgColor: undefined }}
            onClick={() => handleSort('due', 'DESC')}
            icon={<FaSortUp />}
          />
          <IconButton
            size={'xs'}
            bgColor={'#f1e8e6'}
            aria-label="Sort by due date"
            _hover={{ bgColor: undefined }}
            onClick={() => handleSort('due', 'ASC')}
            icon={<FaSortDown />}
          />
        </Flex>
      </Flex>

      <Text flexGrow={1} flexBasis={0} fontWeight={'700'} textAlign={'center'}>
        Assigned
      </Text>
      <Box flexGrow={0.1} flexBasis={0}></Box>
    </Flex>
  );
};
