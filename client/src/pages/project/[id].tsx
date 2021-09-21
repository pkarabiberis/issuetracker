import { Divider, Flex, useDisclosure } from '@chakra-ui/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { GeneralError } from '../../components/GeneralError';
import { Loading } from '../../components/Loading';
import { NavBar } from '../../components/NavBar';
import { ProjectIssues } from '../../components/ProjectIssues';
import { ProjectIssueTitles } from '../../components/ProjectIssueTitles';
import { TitleSection } from '../../components/TitleSection';
import { useCurrentUserQuery } from '../../generated/graphql';
import { useGetProjectFromUrl } from '../../utils/useGetProjectFromUrl';
import { withApollo } from '../../utils/withApollo';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = ({}) => {
  const { data, loading, error, refetch, variables } = useGetProjectFromUrl();
  const { data: meData, loading: userLoading } = useCurrentUserQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hideProjectButtons, setHideProjectButtons] = useState(false);
  const handleSort = (sortBy: string, sortDir: string) => {
    refetch({
      id: data?.project?.project.id,
      sortBy,
      sortDir,
    });
  };

  useEffect(() => {
    if (!meData?.currentUser) {
      setHideProjectButtons(true);
    }

    if (
      !userLoading &&
      !loading &&
      data?.project?.project.users &&
      meData?.currentUser
    ) {
      const isUserInProject = data.project?.project.users.find(
        (u) => u.id === meData.currentUser?.id
      );

      if (!isUserInProject) {
        setHideProjectButtons(true);
      }

      // uncomment to deny access if not part of project
      // if (!isUserInProject) {
      //   router.replace('/');
      // }
    }
  }, [userLoading, loading, data, meData]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <GeneralError />;
  }

  if (!data?.project) {
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
          Could not find the project
        </Flex>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <Head>
        <title>{data.project.project.name}</title>
      </Head>
      <Flex
        mt={10}
        maxW={'1200px'}
        align="center"
        mx={'auto'}
        direction={'column'}
      >
        <TitleSection
          title={data.project.project.name}
          buttonText={'Create issue'}
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
          hideButtons={hideProjectButtons}
          projectId={data.project.project.id}
          variables={typeof variables !== 'undefined' ? variables : undefined}
        />
        <Divider mt={4} orientation="horizontal" />
        <ProjectIssueTitles handleSort={handleSort} />
        {data?.project &&
          data.project.issues.length > 0 &&
          data.project.issues.map((issue) => {
            return (
              <ProjectIssues
                key={issue.id}
                issue={issue}
                hideButton={hideProjectButtons}
              />
            );
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Project);
