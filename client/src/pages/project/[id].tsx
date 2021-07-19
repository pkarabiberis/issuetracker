import { Divider, Flex, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { NavBar } from '../../components/NavBar';
import { ProjectIssues } from '../../components/ProjectIssues';
import { ProjectIssueTitles } from '../../components/ProjectIssueTitles';
import { TitleSection } from '../../components/TitleSection';
import { useProjectQuery } from '../../generated/graphql';
import { scrollbarStyle } from '../../utils/scrollbarStyle';
import { withApollo } from '../../utils/withApollo';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = ({}) => {
  const { query } = useRouter();
  const { data, loading, error, refetch, variables } = useProjectQuery({
    variables: {
      id: typeof query.id !== 'undefined' ? parseInt(query.id as string) : -1,
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSort = (sortBy: string, sortDir: string) => {
    refetch({
      id: data?.project?.project.id,
      sortBy,
      sortDir,
    });
  };

  if (loading) {
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
          Loading...
        </Flex>
      </>
    );
  }

  if (error) {
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
          {error.message}
        </Flex>
      </>
    );
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
          projectId={data.project.project.id}
          variables={typeof variables !== 'undefined' ? variables : undefined}
        />
        <Divider mt={4} orientation="horizontal" />
        <ProjectIssueTitles handleSort={handleSort} />
        {data?.project &&
          data.project.issues.length >= 1 &&
          data.project.issues.map((issue) => {
            return (
              <Flex
                key={issue.id}
                _hover={{ bgColor: 'gray.50', cursor: 'pointer' }}
                p={2}
                mt={4}
                alignItems={'center'}
                w={'100%'}
              >
                <ProjectIssues issue={issue} />
              </Flex>
            );
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Project);
