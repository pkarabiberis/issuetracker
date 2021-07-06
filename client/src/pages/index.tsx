import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { useUserProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data, refetch } = useUserProjectsQuery();
  useEffect(() => {
    refetch();
  }, []);
  return (
    <>
      <NavBar />
      <Flex
        mt={10}
        maxW={'1200px'}
        align='center'
        mx={'auto'}
        direction={'column'}
      >
        <Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
          <Heading>Home</Heading>
          <Button
            textColor={'white'}
            bgColor='blue.500'
            _hover={{ bgColor: 'blue.400' }}
          >
            Create
          </Button>
        </Flex>
        <Divider mt={4} orientation='horizontal' />
        <Flex p={2} mt={4} bgColor={'gray.50'} alignItems={'center'} w={'100%'}>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
          >
            Project
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Members
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'end'}
          >
            Last updated
          </Text>
        </Flex>

        {data?.userProjects &&
          data.userProjects.map((pr) => {
            return (
              <Flex p={2} mt={4} alignItems={'center'} w={'100%'}>
                <Text flexGrow={1} flexBasis={0}>
                  {pr.name}
                </Text>
                <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
                  {pr.creatorId}
                </Text>
                <Text textAlign={'end'} flexGrow={1} flexBasis={0}>
                  {pr.updatedAt}
                </Text>
              </Flex>
            );
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
