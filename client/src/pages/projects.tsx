import { Divider, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useEffect } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { NavBar } from '../components/NavBar';
import { TitleSection } from '../components/TitleSection';
import {
  useCurrentUserQuery,
  useUserProjectsQuery,
} from '../generated/graphql';
import { membersAmount } from '../utils/membersAmount';
import { toDate } from '../utils/toDate';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const Projects = () => {
  const { data, refetch } = useUserProjectsQuery();
  const { data: meData } = useCurrentUserQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useIsAuth();
  useEffect(() => {
    refetch();
  }, [meData?.currentUser?.id]);

  return (
    <>
      <NavBar />
      {isOpen && (
        <CreateProjectDialog
          isOpen={isOpen}
          onClose={onClose}
          fromIndexPage={false}
        />
      )}
      <Flex
        mt={10}
        maxW={'1200px'}
        align="center"
        mx={'auto'}
        direction={'column'}
      >
        <TitleSection buttonText={'Create project'} onOpen={onOpen} />
        <Divider mt={4} orientation="horizontal" />
        {data?.userProjects?.length ? (
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

        {data?.userProjects &&
          data.userProjects.map((pr) => {
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
                    {membersAmount(pr.users)}
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

export default withApollo({ ssr: false })(Projects);