import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Collapse,
  Flex,
  Icon,
  IconButton,
  List,
  ListItem,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import {
  ProjectDocument,
  ProjectQuery,
  ProjectQueryVariables,
  useCreateIssueMutation,
} from '../generated/graphql';
import { scrollbarStyle } from '../utils/scrollbarStyle';
import { useGetProjectFromUrl } from '../utils/useGetProjectFromUrl';
import { BaseModal } from './BaseModal';
import { InputField } from './InputField';
import { PrimaryButton } from './PrimaryButton';

interface CreateIssueDialogProps {
  projectId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
  variables: ProjectQueryVariables | undefined;
}

export const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({
  projectId,
  isOpen,
  onClose,
  variables,
}) => {
  const [createIssue] = useCreateIssueMutation();
  const [usersToAssign, setUsersToAssign] = useState<
    { id: number; username: string }[]
  >([]);
  const { data: projectUsers } = useGetProjectFromUrl();
  const [showUserList, setShowUserList] = useState(false);
  const canToggle =
    usersToAssign.length !== projectUsers?.project?.project.users?.length;
  const open = () => {
    if (canToggle) {
      setShowUserList(!showUserList);
    }
  };

  useEffect(() => {
    if (!canToggle) {
      setShowUserList(false);
    }
  }, [usersToAssign]);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <Formik
          initialValues={{ title: '', due: '' }}
          onSubmit={async (values) => {
            const idsToAssign = usersToAssign.map(({ id }) => id);
            await createIssue({
              variables: {
                input: {
                  title: values.title,
                  due: new Date(values.due).getTime().toString(),
                  projectId: projectId!,
                },
                assignedUsers: idsToAssign,
              },
              update: (cache, { data: newIssueData }) => {
                const existingProject: ProjectQuery | null = cache.readQuery({
                  query: ProjectDocument,
                  variables: { ...variables },
                });
                cache.writeQuery<ProjectQuery>({
                  query: ProjectDocument,
                  data: {
                    project: {
                      __typename: 'ProjectResponse',
                      project: { ...existingProject?.project?.project! },
                      issues: [
                        newIssueData?.createIssue!,
                        ...(existingProject?.project?.issues || []),
                      ],
                    },
                  },
                  variables: {
                    ...variables,
                  },
                });
              },
            });
            onClose();
          }}
        >
          {({ isSubmitting }) => {
            return (
              <Box mx={'auto'} maxW={'400px'}>
                <Text color={'#361d32'} fontSize={20} fontWeight={'bold'}>
                  Create issue
                </Text>
                <Form style={{ marginTop: '24px' }}>
                  <InputField name='title' label='Issue name' />
                  <Box mt={4}>
                    <InputField name='due' type='date' label='Due' />
                  </Box>
                  <Box mt={4}>
                    <Flex justifyContent={'space-between'}>
                      <Text fontSize={'md'} fontWeight={'medium'}>
                        Assign to
                      </Text>
                      <Icon
                        _hover={{ color: 'gray.500', cursor: 'pointer' }}
                        w={6}
                        h={6}
                        as={
                          showUserList ? AiOutlineUserDelete : AiOutlineUserAdd
                        }
                        onClick={open}
                      />
                    </Flex>
                    <Flex mt={2} align={'center'} wrap={'wrap'}>
                      {usersToAssign.length >= 1 &&
                        usersToAssign.map(({ id, username }) => (
                          <Badge
                            colorScheme={'pink'}
                            variant={'solid'}
                            color={'white'}
                            px={2}
                            py={1}
                            ml={2}
                            mb={2}
                            key={id}
                          >
                            <Flex align={'center'}>
                              <Text>{username}</Text>
                              <IconButton
                                aria-label='Delete assigned user'
                                colorScheme={'pink'}
                                icon={<CloseIcon />}
                                size={'xs'}
                                ml={2}
                                onClick={() => {
                                  const usersAfterDeletion = [
                                    ...usersToAssign,
                                  ].filter((u) => u.id !== id);
                                  setUsersToAssign(usersAfterDeletion);
                                }}
                              />
                            </Flex>
                          </Badge>
                        ))}
                    </Flex>
                  </Box>
                  <Collapse in={showUserList} animateOpacity>
                    <Box
                      sx={scrollbarStyle()}
                      maxH={'200px'}
                      overflowY={'auto'}
                      mt={4}
                    >
                      <List spacing={3}>
                        {projectUsers?.project?.project.users &&
                          projectUsers.project.project.users.map((u) => {
                            const isUserAssigned = usersToAssign.find(
                              (e) => e.id === u.id
                            );
                            if (!isUserAssigned) {
                              return (
                                <ListItem key={u.id}>
                                  <Badge
                                    colorScheme={'whiteAlpha'}
                                    variant={'solid'}
                                    color={'black'}
                                    p={1}
                                  >
                                    <Flex alignItems={'center'}>
                                      <Text>{u.username}</Text>
                                      <IconButton
                                        ml={2}
                                        aria-label='Add user'
                                        size={'xs'}
                                        bgColor={'white'}
                                        icon={<AddIcon />}
                                        onClick={() => {
                                          setUsersToAssign([
                                            {
                                              id: u.id,
                                              username: u.username,
                                            },
                                            ...usersToAssign,
                                          ]);
                                        }}
                                      />
                                    </Flex>
                                  </Badge>
                                </ListItem>
                              );
                            } else {
                              return null;
                            }
                          })}
                      </List>
                    </Box>
                  </Collapse>
                  <ModalFooter p={0} mt={5}>
                    <PrimaryButton
                      buttonText={'Create'}
                      type={'submit'}
                      isLoading={isSubmitting}
                    />
                  </ModalFooter>
                </Form>
              </Box>
            );
          }}
        </Formik>
      </BaseModal>
    </>
  );
};
