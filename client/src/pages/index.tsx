import { Divider, Flex, Text, useDisclosure } from '@chakra-ui/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { GeneralError } from '../components/GeneralError';
import { Loading } from '../components/Loading';
import { NavBar } from '../components/NavBar';
import { Project } from '../components/Project';
import { ProjectTitles } from '../components/ProjectTitles';
import { TitleSection } from '../components/TitleSection';
import { useCurrentUserQuery, useProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data, loading, error } = useProjectsQuery();
  const { data: meData } = useCurrentUserQuery();
  const [myProjects, setMyProjects] = useState<number[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (meData?.currentUser) {
      data?.projects?.projects.forEach((p) => {
        const isMyProject = p.users?.find(
          (u) => u.id === meData?.currentUser!.id
        );
        if (isMyProject && !myProjects?.includes(p.id)) {
          setMyProjects((projects) => [...(projects || []), p.id]);
        }
      });
    }
  }, [meData?.currentUser, data?.projects?.projects]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <GeneralError />;
  }

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
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

        {data?.projects?.projects && data.projects.projects.length > 0 ? (
          <ProjectTitles />
        ) : (
          <Text mt={4}>No projects yet</Text>
        )}

        {data?.projects?.projects &&
          data.projects.projects.map((pr) =>
            myProjects?.includes(pr.id) ? (
              <Project pr={pr} userProject={true} key={pr.id} />
            ) : (
              <Project pr={pr} userProject={false} key={pr.id} />
            )
          )}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
