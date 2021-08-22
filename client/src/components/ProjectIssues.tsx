import { Badge, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Issue } from '../generated/graphql';
import { getBadgeColor } from '../utils/getBadgeColor';
import { getIssueVisibility } from '../utils/getIssueVisibility';
import { membersAmount } from '../utils/membersAmount';
import { toDate } from '../utils/toDate';
import { EditIssueDialog } from './EditIssueDialog';

interface ProjectIssuesProps {
  issue: any;
  hideButton: boolean;
}

export const ProjectIssues: React.FC<ProjectIssuesProps> = ({
  issue,
  hideButton,
}) => {
  const realIssue = issue as Issue;
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <>
      {realIssue && (
        <>
          <Flex
            alignItems={'center'}
            p={2}
            mt={4}
            display={{
              base: 'flex',
              sm: 'flex',
              md: 'none',
              lg: 'none',
              xl: 'none',
              '2xl': 'none',
            }}
            w={'100%'}
          >
            <Text flex={1} flexGrow={1} textAlign={'center'}>
              {realIssue.title ? realIssue.title : '-'}
            </Text>

            <Text flex={1} flexGrow={1} textAlign={'center'}>
              <Badge colorScheme={getBadgeColor(realIssue.status)}>
                {realIssue.status}
              </Badge>
            </Text>

            <Icon
              as={BsThreeDotsVertical}
              h={5}
              flexGrow={0.1}
              flexBasis={0}
              onClick={onOpen}
              visibility={hideButton ? 'hidden' : 'visible'}
            />
          </Flex>
          <Flex
            key={issue.id}
            _hover={{ bgColor: '#fcfafa', cursor: 'pointer' }}
            p={2}
            mt={4}
            alignItems={'center'}
            w={'100%'}
            display={{
              base: 'none',
              sm: 'none',
              md: 'flex',
              lg: 'flex',
              xl: 'flex',
              '2xl': 'flex',
            }}
          >
            <Text flexGrow={1} flexBasis={0} textAlign={'center'}>
              {realIssue.title}
            </Text>

            <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
              <Badge colorScheme={getBadgeColor(realIssue.status)}>
                {realIssue.status}
              </Badge>
            </Text>

            <Text
              visibility={getIssueVisibility()}
              textAlign={'center'}
              flexGrow={1}
              flexBasis={0}
            >
              {toDate(realIssue.createdAt)}
            </Text>

            <Text
              visibility={getIssueVisibility()}
              textAlign={'center'}
              flexGrow={1}
              flexBasis={0}
            >
              {realIssue.due ? toDate(realIssue.due) : '-'}
            </Text>

            <Text
              visibility={getIssueVisibility()}
              flexGrow={1}
              flexBasis={0}
              textAlign={'center'}
            >
              {membersAmount(realIssue.assignedUsers)}
            </Text>

            <Icon
              visibility={hideButton ? 'hidden' : 'visible'}
              as={BsThreeDotsVertical}
              w={5}
              h={5}
              flexGrow={0.1}
              flexBasis={0}
              onClick={onOpen}
            />

            {isOpen && (
              <EditIssueDialog
                issue={realIssue}
                isOpen={isOpen}
                onClose={onClose}
              />
            )}
          </Flex>
        </>
      )}
    </>
  );
};
