import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { withApollo } from '../../utils/withApollo';
import { NavBar } from '../../components/NavBar';
import { Flex, Heading, Button, Divider, Text } from '@chakra-ui/react';
import { useProjectQuery } from '../../generated/graphql';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = ({}) => {
  const { query } = useRouter();
  const { data, loading, error } = useProjectQuery({
    variables: {
      id: typeof query.id !== 'undefined' ? parseInt(query.id as string) : -1,
    },
  });

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
          <Heading>{data.project.name}</Heading>
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
            textAlign={'end'}
          >
            Created
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'end'}
          >
            Due
          </Text>
          <Text
            flexGrow={1}
            flexBasis={0}
            textColor={'gray.500'}
            fontWeight={'bold'}
            textAlign={'end'}
          >
            Assigned
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default withApollo({ ssr: true })(Project);
