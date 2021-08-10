import { Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { BasicProjectResponseFragment } from '../generated/graphql';
import { membersAmount } from '../utils/membersAmount';
import { toDate } from '../utils/toDate';

interface ProjectProps {
  pr: BasicProjectResponseFragment;
  userProject: boolean;
}

export const Project: React.FC<ProjectProps> = ({ pr, userProject }) => {
  return userProject ? (
    <NextLink href='/project/[id]' as={`/project/${pr.id}`}>
      <Flex
        _hover={{ bgColor: '#fcfafa', cursor: 'pointer' }}
        p={2}
        mt={4}
        key={pr.id}
        alignItems={'center'}
        w={'100%'}
      >
        <Flex flexGrow={1} flexBasis={0} alignItems='center'>
          <Icon color={'green.500'} as={GoPrimitiveDot} />
          <Text ml={2}>{pr.name}</Text>
        </Flex>
        <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
          {membersAmount(pr.users)}
        </Text>
        <Text textAlign={'end'} flexGrow={1} flexBasis={0}>
          {toDate(pr.updatedAt)}
        </Text>
      </Flex>
    </NextLink>
  ) : (
    <Flex
      _hover={{ bgColor: '#fcfafa', cursor: 'not-allowed' }}
      p={2}
      mt={4}
      key={pr.id}
      alignItems={'center'}
      w={'100%'}
    >
      <Flex flexGrow={1} flexBasis={0} alignItems='center'>
        <Icon color={'red.500'} as={GoPrimitiveDot} />
        <Text ml={2}>{pr.name}</Text>
      </Flex>
      <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
        {membersAmount(pr.users)}
      </Text>
      <Text textAlign={'end'} flexGrow={1} flexBasis={0}>
        {toDate(pr.updatedAt)}
      </Text>
    </Flex>
  );
};
