import { Divider, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { NavBar } from '../components/NavBar';
import { Project } from '../components/Project';
import { ProjectTitles } from '../components/ProjectTitles';
import { TitleSection } from '../components/TitleSection';
import {
  useCurrentUserQuery,
  useUserProjectsQuery,
} from '../generated/graphql';
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
        {data?.userProjects && data.userProjects.length > 0 ? (
          <ProjectTitles />
        ) : (
          <Text mt={4}>No projects yet</Text>
        )}

        {data?.userProjects &&
          data.userProjects.map((pr) => {
            return <Project pr={pr} userProject={true} key={pr.id} />;
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: false })(Projects);
