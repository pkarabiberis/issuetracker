import { Divider, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { NavBar } from '../components/NavBar';
import { TitleSection } from '../components/TitleSection';
import { useCurrentUserQuery, useProjectsQuery } from '../generated/graphql';
import { membersAmount } from '../utils/membersAmount';
import { toDate } from '../utils/toDate';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data } = useProjectsQuery();
  const { data: meData } = useCurrentUserQuery();
  const [myProjects, setMyProjects] = useState<number[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    data?.projects?.projects.forEach((p) => {
      const isMyProject = p.users?.find(
        (u) => u.id === meData?.currentUser!.id
      );
      if (isMyProject && !myProjects?.includes(p.id)) {
        setMyProjects((projects) => [...(projects || []), p.id]);
      }
    });
  }, [meData?.currentUser]);

  return (
    <>
      <NavBar />
      {isOpen && (
        <CreateProjectDialog
          isOpen={isOpen}
          onClose={onClose}
          fromIndexPage={true}
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
          data.projects.projects.map((pr) =>
            myProjects?.includes(pr.id) ? (
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
            ) : (
              <Flex
                _hover={{ bgColor: '#fcfafa', cursor: 'not-allowed' }}
                p={2}
                mt={4}
                key={pr.id}
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
            )
          )}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
