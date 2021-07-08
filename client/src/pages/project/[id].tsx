import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { withApollo } from '../../utils/withApollo';
import { NavBar } from '../../components/NavBar';
import {
  Flex,
  Heading,
  Button,
  Divider,
  Text,
  Badge,
  Icon,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { useProjectQuery } from '../../generated/graphql';
import { toDate } from '../../utils/toDate';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { EditIssueDialog } from '../../components/EditIssueDialog';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = ({}) => {
  const { query } = useRouter();
  const { data, loading, error } = useProjectQuery({
    variables: {
      id: typeof query.id !== 'undefined' ? parseInt(query.id as string) : -1,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(data?.project?.issues);

  if (loading) {
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
          align='center'
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
        <Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
          <Heading>{data.project.project.name}</Heading>
          <Button
            textColor={'white'}
            bgColor='blue.500'
            _hover={{ bgColor: 'blue.400' }}
          >
            Create issue
          </Button>
        </Flex>
        <Divider mt={4} orientation='horizontal' />
        <Flex p={2} mt={4} bgColor={'gray.50'} alignItems={'center'} w={'100%'}>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Issue
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Status
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Created
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Due
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Assigned
          </Text>
          <Box flexGrow={0.1} flexBasis={0}></Box>
        </Flex>
        {data?.project.issues.length &&
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
                <Text flexGrow={1} flexBasis={0} textAlign={'center'}>
                  {issue.title}
                </Text>

                <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
                  <Badge colorScheme='purple'>{issue.status}</Badge>
                </Text>

                <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
                  {toDate(issue.createdAt)}
                </Text>

                <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
                  {toDate(issue.due)}
                </Text>

                <Text flexGrow={1} flexBasis={0} textAlign={'center'}>
                  {issue.assignedUsers?.length &&
                  issue.assignedUsers?.length === 1
                    ? issue.assignedUsers[0].username
                    : `${issue?.assignedUsers?.[0].username} and ${
                        issue?.assignedUsers!.length - 1
                      } other`}
                </Text>

                <Icon
                  as={BsThreeDotsVertical}
                  w={5}
                  h={5}
                  flexGrow={0.1}
                  flexBasis={0}
                  onClick={onOpen}
                />

                {isOpen && (
                  <EditIssueDialog
                    issue={issue}
                    isOpen={isOpen}
                    onClose={onClose}
                  />
                )}
              </Flex>
            );
          })}
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Project);
