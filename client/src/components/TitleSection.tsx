import { Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import {
  ProjectQueryVariables,
  useCurrentUserQuery,
} from '../generated/graphql';
import { CreateIssueDialog } from './CreateIssueDialog';
import { PrimaryButton } from './PrimaryButton';

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
  return (
    <Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
      {title && (
        <Text ml={[4, 4, 4, 4, 0, 0]} color={'#361d32'} fontSize={20}>
          {title}
        </Text>
      )}

      <PrimaryButton
        mr={[4, 4, 4, 4, 0, 0]}
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
    </Flex>
  );
};
