import { Divider, Flex, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { useEffect } from 'react';
import { GeneralError } from '../../components/GeneralError';
import { Loading } from '../../components/Loading';
import { NavBar } from '../../components/NavBar';
import { ProjectIssues } from '../../components/ProjectIssues';
import { ProjectIssueTitles } from '../../components/ProjectIssueTitles';
import { TitleSection } from '../../components/TitleSection';
import { useCurrentUserQuery } from '../../generated/graphql';
import { useGetProjectFromUrl } from '../../utils/useGetProjectFromUrl';
import { useIsAuth } from '../../utils/useIsAuth';
import { withApollo } from '../../utils/withApollo';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const { data, loading, error, refetch, variables } = useGetProjectFromUrl();
  const { data: meData, loading: userLoading } = useCurrentUserQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSort = (sortBy: string, sortDir: string) => {
    refetch({
      id: data?.project?.project.id,
      sortBy,
      sortDir,
    });
  };

  useEffect(() => {
    if (
      !userLoading &&
      !loading &&
      data?.project?.project.users &&
      meData?.currentUser
    ) {
      const isAllowed = data.project?.project.users.find(
        (u) => u.id === meData.currentUser?.id
      );
      if (!isAllowed) {
        router.replace('/');
      }
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
          align='center'
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
      <Flex
        mt={10}
        maxW={'1200px'}
        align='center'
        mx={'auto'}
        direction={'column'}
      >
        <TitleSection
          title={data.project.project.name}
          buttonText={'Create issue'}
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
          projectId={data.project.project.id}
          variables={typeof variables !== 'undefined' ? variables : undefined}
        />
        <Divider mt={4} orientation='horizontal' />
        <ProjectIssueTitles handleSort={handleSort} />
        {data?.project &&
          data.project.issues.length > 0 &&
          data.project.issues.map((issue) => {
            return <ProjectIssues key={issue.id} issue={issue} />;
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Project);
