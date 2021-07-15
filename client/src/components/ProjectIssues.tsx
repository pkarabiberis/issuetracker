import { Badge, Icon, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Issue } from '../generated/graphql';
import { getBadgeColor } from '../utils/getBadgeColor';
import { toDate } from '../utils/toDate';
import { EditIssueDialog } from './EditIssueDialog';

interface ProjectIssuesProps {
  issue: any;
}

export const ProjectIssues: React.FC<ProjectIssuesProps> = ({ issue }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const realIssue = issue as Issue;
  return (
    <>
      {realIssue !== undefined && (
        <>
          <Text flexGrow={1} flexBasis={0} textAlign={'center'}>
            {realIssue.title}
          </Text>

          <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
            <Badge colorScheme={getBadgeColor(realIssue.status)}>
              {realIssue.status}
            </Badge>
          </Text>

          <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
            {toDate(realIssue.createdAt)}
          </Text>

          <Text textAlign={'center'} flexGrow={1} flexBasis={0}>
            {realIssue.due ? toDate(realIssue.due) : '-'}
          </Text>

          <Text flexGrow={1} flexBasis={0} textAlign={'center'}>
            {/* clean up later 
           formats text based on assigned users */}
            {realIssue?.assignedUsers && realIssue?.assignedUsers?.length >= 1
              ? realIssue.assignedUsers?.length === 1
                ? realIssue.assignedUsers[0].username
                : `${realIssue?.assignedUsers?.[0].username} and ${
                    realIssue?.assignedUsers!.length - 1
                  } other`
              : '-'}
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
              issue={realIssue}
              isOpen={isOpen}
              onClose={onClose}
            />
          )}
        </>
      )}
    </>
  );
};
