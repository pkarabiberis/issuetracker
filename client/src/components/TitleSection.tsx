import { Flex, Icon, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import {
  ProjectQueryVariables,
  useCurrentUserQuery,
} from '../generated/graphql';
import { CreateIssueDialog } from './CreateIssueDialog';
import { PrimaryButton } from './PrimaryButton';
import { MdEdit } from 'react-icons/md';
import { BaseModal } from './BaseModal';
import { EditProjectModal } from './EditProjectModal';

interface TitleSectionProps {
  title?: string;
  buttonText: string;
  onOpen?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  projectId?: number;
  variables?: ProjectQueryVariables | undefined;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  buttonText,
  onOpen,
  isOpen,
  onClose,
  projectId,
  variables,
}) => {
  const { data } = useCurrentUserQuery();
  const router = useRouter();
  const {
    isOpen: isOpenEditProject,
    onOpen: onOpenEditProject,
    onClose: onCloseEditProject,
  } = useDisclosure();
  return (
    <Flex
      alignItems={'center'}
      flexDir={['column', 'column', 'row', 'row', 'row', 'row']}
      justifyContent={'space-between'}
      w={'100%'}
    >
      {title && (
        <Flex
          mx={[4, 4, 4, 4, 0, 0]}
          alignItems={'center'}
          flexDir={['column', 'column', 'row', 'row', 'row', 'row']}
        >
          <Text color={'#361d32'} overflowWrap={'anywhere'} fontSize={20}>
            {title}
          </Text>
          <Icon
            ml={2}
            aria-label='Edit project'
            boxSize={7}
            bgColor='white'
            as={MdEdit}
            onClick={onOpenEditProject}
          />
        </Flex>
      )}
      <PrimaryButton
        mt={[8, 8, 0, 0, 0, 0]}
        mr={title ? [0, 0, 4, 4, 4, 4] : 4}
        ml={!title ? 'auto' : undefined}
        buttonText={buttonText}
        cursor={!data?.currentUser ? 'not-allowed' : 'pointer'}
        onClick={data?.currentUser ? onOpen : () => router.replace('/login')}
      />

      {isOpen && (
        <CreateIssueDialog
          isOpen={isOpen}
          onClose={onClose!}
          projectId={projectId || undefined}
          variables={variables}
        />
      )}
      {isOpenEditProject && (
        <EditProjectModal
          isOpen={isOpenEditProject}
          onClose={onCloseEditProject}
        />
      )}
    </Flex>
  );
};
