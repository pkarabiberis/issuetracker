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
  hideButtons?: boolean;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  buttonText,
  onOpen,
  isOpen,
  onClose,
  projectId,
  variables,
  hideButtons,
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
          <Text color={'#361d32'} overflowWrap={'anywhere'} fontWeight={500}>
            {title}
          </Text>
          <Icon
            visibility={hideButtons ? 'hidden' : 'visible'}
            ml={2}
            _hover={{ color: '#c7c7b7' }}
            aria-label="Edit project"
            boxSize={7}
            bgColor="white"
            as={MdEdit}
            onClick={onOpenEditProject}
          />
        </Flex>
      )}
      <PrimaryButton
        visibility={hideButtons ? 'hidden' : 'visible'}
        mt={[8, 8, 0, 0, 0, 0]}
        mr={title ? [0, 0, 4, 4, 0, 0] : [4, 4, 4, 4, 0, 0]}
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
