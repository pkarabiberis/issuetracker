import { Flex, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { ProjectQueryVariables } from '../generated/graphql';
import { CreateIssueDialog } from './CreateIssueDialog';

interface TitleSectionProps {
  title: string;
  buttonText: string;
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  projectId?: number;
  variables: ProjectQueryVariables | undefined;
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
      <Heading>{title}</Heading>
      <Button
        textColor={'white'}
        bgColor='blue.500'
        _hover={{ bgColor: 'blue.400' }}
        onClick={onOpen}
      >
        {buttonText}
      </Button>
      {isOpen && (
        <CreateIssueDialog
          isOpen={isOpen}
          onClose={onClose}
          projectId={projectId || undefined}
          variables={variables}
        />
      )}
    </Flex>
  );
};
