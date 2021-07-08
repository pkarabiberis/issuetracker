import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { useUserProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { GoPrimitiveDot } from 'react-icons/go';
import NextLink from 'next/link';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { toDate } from '../utils/toDate';

const Index = () => {
  const { data, refetch } = useUserProjectsQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    refetch();
  }, []);
  return (
    <>
      <NavBar />
      {isOpen && <CreateProjectDialog isOpen={isOpen} onClose={onClose} />}
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
            onClick={onOpen}
          >
            Create project
          </Button>
        </Flex>
        <Divider mt={4} orientation='horizontal' />
        {data?.userProjects?.length ? (
          <Flex
            p={2}
            mt={4}
            bgColor={'gray.50'}
            alignItems={'center'}
            w={'100%'}
          >
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
        ) : (
          <Text mt={4}>No projects yet</Text>
        )}

        {data?.userProjects &&
          data.userProjects.map((pr) => {
            return (
              <NextLink
                key={pr.id}
                href='/project/[id]'
                as={`/project/${pr.id}`}
              >
                <Flex
                  _hover={{ bgColor: 'gray.50', cursor: 'pointer' }}
                  p={2}
                  mt={4}
                  alignItems={'center'}
                  w={'100%'}
                >
                  <Flex flexGrow={1} flexBasis={0} alignItems='center'>
                    <Icon color={'pink.700'} as={GoPrimitiveDot} />
                    <Text ml={2}>{pr.name}</Text>
                  </Flex>
                  <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
                    {pr.users?.length && pr.users.length === 1
                      ? pr.users[0].username
                      : `${pr.users?.[0].username} and ${
                          pr.users!.length - 1
                        } others`}
                  </Text>
                  <Text textAlign={'end'} flexGrow={1} flexBasis={0}>
                    {toDate(pr.updatedAt)}
                  </Text>
                </Flex>
              </NextLink>
            );
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
