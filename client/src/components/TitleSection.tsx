import { Flex, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { ProjectQueryVariables } from '../generated/graphql';
import { CreateIssueDialog } from './CreateIssueDialog';

interface TitleSectionProps {
  title: string;
  buttonText: string;
  onOpen: () => void;
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
  return (
    <Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
      <Heading fontWeight={'300'}>{title}</Heading>
      <Button
        textColor={'#361d32'}
        bgColor={'transparent'}
        border={'1px'}
        fontWeight={'700'}
        borderColor={'#361d32'}
        _hover={{ bgColor: '#f1e8e6' }}
        onClick={onOpen}
      >
        {buttonText}
      </Button>
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
