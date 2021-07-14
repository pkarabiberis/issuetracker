import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { AiOutlineUserAdd } from 'react-icons/ai';
import React from 'react';
import {
  ProjectDocument,
  ProjectQuery,
  useCreateIssueMutation,
  useUsersQuery,
} from '../generated/graphql';
import { InputField } from './InputField';
import { useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';

interface CreateIssueDialogProps {
  projectId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const [createIssue, { data, loading }] = useCreateIssueMutation();
  const [usersToAssign, setUsersToAssign] = useState<
    { id: number; username: string }[]
  >([]);
  const { data: userData } = useUsersQuery();
  const [showUserList, setShowUserList] = useState(false);
  const open = () => {
    setShowUserList(!showUserList);
  };

  useEffect(() => {
    console.log('useEffect: ', usersToAssign);
  }, [usersToAssign]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ title: '', due: '' }}
              onSubmit={async (values, { setErrors }) => {
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
                    const existingProject: ProjectQuery | null =
                      cache.readQuery({
                        query: ProjectDocument,
                        variables: {
                          id: projectId,
                        },
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
                        id: projectId!,
                      },
                    });
                  },
                });
                onClose();
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Box w={'400px'}>
                    <Form>
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
                            as={AiOutlineUserAdd}
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
                      <Box maxH={'200px'} overflowY={'auto'} mt={4}>
                        <List spacing={3}>
                          {showUserList &&
                            userData?.users &&
                            userData.users.map((u) => {
                              const shouldShowUser = usersToAssign.find(
                                (e) => e.id === u.id
                              );
                              if (!shouldShowUser) {
                                return (
                                  <ListItem key={u.id}>
                                    <Badge
                                      _hover={{
                                        color: 'gray.500',
                                        cursor: 'pointer',
                                      }}
                                      colorScheme={'whiteAlpha'}
                                      variant={'solid'}
                                      color={'black'}
                                      p={1}
                                      onClick={() => {
                                        setUsersToAssign([
                                          { id: u.id, username: u.username },
                                          ...usersToAssign,
                                        ]);
                                      }}
                                    >
                                      {u.username}
                                    </Badge>
                                  </ListItem>
                                );
                              } else {
                                return null;
                              }
                            })}
                        </List>
                      </Box>
                      <ModalFooter>
                        <Button
                          isLoading={isSubmitting}
                          colorScheme='blue'
                          mr={3}
                          type='submit'
                        >
                          Create
                        </Button>
                      </ModalFooter>
                    </Form>
                  </Box>
                );
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
