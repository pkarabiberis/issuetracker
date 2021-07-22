import { Divider, Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { NavBar } from '../components/NavBar';
import { TitleSection } from '../components/TitleSection';
import { useProjectsQuery } from '../generated/graphql';
import { toDate } from '../utils/toDate';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data } = useProjectsQuery();
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
        <TitleSection buttonText={'Create project'} />
        <Divider mt={4} orientation="horizontal" />
        {data?.projects?.projects?.length ? (
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
            <Text
              flexGrow={1}
              flexBasis={0}
              fontWeight={'bold'}
              textAlign={'center'}
            >
              Members
            </Text>
            <Text
              flexGrow={1}
              flexBasis={0}
              fontWeight={'bold'}
              textAlign={'end'}
            >
              Last updated
            </Text>
          </Flex>
        ) : (
          <Text mt={4}>No projects yet</Text>
        )}

        {data?.projects?.projects &&
          data.projects.projects.map((pr) => {
            return (
              <NextLink
                key={pr.id}
                href="/project/[id]"
                as={`/project/${pr.id}`}
              >
                <Flex
                  _hover={{ bgColor: '#fcfafa', cursor: 'pointer' }}
                  p={2}
                  mt={4}
                  alignItems={'center'}
                  w={'100%'}
                >
                  <Flex flexGrow={1} flexBasis={0} alignItems="center">
                    <Icon color={'pink.700'} as={GoPrimitiveDot} />
                    <Text ml={2}>{pr.name}</Text>
                  </Flex>
                  <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
                    {pr.users && pr.users?.length >= 1 && pr.users.length === 1
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
