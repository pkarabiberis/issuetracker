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
        <Flex
          p={2}
          mt={4}
          bgColor={'gray.50'}
          alignItems={'center'}
          justifyContent={'space-between'}
          w={'100%'}
        >
          <Text textColor={'gray.500'} fontWeight={'bold'}>
            Project
          </Text>
          <Text textColor={'gray.500'} fontWeight={'bold'}>
            Members
          </Text>
          <Text textColor={'gray.500'} fontWeight={'bold'}>
            Last updated
          </Text>
        </Flex>

        {data?.userProjects &&
          data.userProjects.map((pr) => {
            return (
              <Flex
                p={2}
                mt={4}
                alignItems={'center'}
                justifyContent={'space-between'}
                w={'100%'}
              >
                <Text>{pr.name}</Text>
                <Text>{pr.creatorId}</Text>
                <Text>{pr.id}</Text>
              </Flex>
            );
          })}

        {/* <Box mr={'auto'}>
          {data?.userProjects &&
            data.userProjects.map((pr) => <Box key={pr.id}>{pr.name}</Box>)}
        </Box> */}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
