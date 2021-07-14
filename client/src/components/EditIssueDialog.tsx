import { CloseIcon } from '@chakra-ui/icons';
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
import React, { useEffect, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import {
  Issue,
  useUpdateIssueMutation,
  useUsersQuery,
} from '../generated/graphql';
import { InputField } from './InputField';

interface EditIssueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
}

export const EditIssueDialog: React.FC<EditIssueDialogProps> = ({
  isOpen,
  onClose,
  issue,
}) => {
  const [status, setStatus] = useState(issue.status);
  const [showUserList, setShowUserList] = useState(false);
  const [updateIssue, { loading, error }] = useUpdateIssueMutation();
  const { data } = useUsersQuery();
  let assignedUsers: number[] = [];
  const usersToShow: number[] = [];

  issue?.assignedUsers?.forEach((u) => assignedUsers.push(u.id));
  data?.users?.forEach((user) => {
    if (!assignedUsers.includes(user.id)) {
      usersToShow.push(user.id);
    }
  });

  const issueDue = new Date(Number(issue.due!));

  //insert zero to initial value if needed
  //for input type="date"
  const initialMonth =
    issueDue.getMonth() + 1 < 10
      ? `0${(issueDue.getMonth() + 1).toString()}`
      : `${(issueDue.getMonth() + 1).toString()}`;

  const open = () => {
    if (usersToShow.length) {
      setShowUserList(!showUserList);
    }
  };
  const close = () => setShowUserList(false);

  useEffect(() => {
    if (!usersToShow.length) {
      setShowUserList(false);
    }
  }, [usersToShow]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                title: issue.title,
                due: `${issueDue
                  .getFullYear()
                  .toString()}-${initialMonth}-${issueDue
                  .getDate()
                  .toString()}`,
              }}
              onSubmit={async (values, { setErrors }) => {
                await updateIssue({
                  variables: {
                    id: issue.id,
                    title: values.title,
                    due: values.due
                      ? new Date(values.due).getTime().toString()
                      : null,
                    status,
                    assignedUsers,
                  },
                });

                onClose();
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Box w={'400px'}>
                    <Form>
                      <InputField name='title' label='Issue' />
                      <Box mt={4}>
                        <Text fontSize={'md'} fontWeight={'medium'}>
                          Status
                        </Text>
                        <Flex mt={2}>
                          <Badge
                            onClick={() => setStatus('Ongoing')}
                            p={2}
                            ml={2}
                            colorScheme='purple'
                            _hover={{ cursor: 'pointer' }}
                            variant={
                              status === 'Ongoing' ? undefined : 'outline'
                            }
                          >
                            Ongoing
                          </Badge>
                          <Badge
                            ml={4}
                            p={2}
                            colorScheme='green'
                            variant={
                              status === 'Completed' ? undefined : 'outline'
                            }
                            onClick={() => setStatus('Completed')}
                            _hover={{ cursor: 'pointer' }}
                          >
                            Completed
                          </Badge>
                          <Badge
                            ml={4}
                            p={2}
                            colorScheme='red'
                            variant={
                              status === 'Closed' ? undefined : 'outline'
                            }
                            onClick={() => setStatus('Closed')}
                            _hover={{ cursor: 'pointer' }}
                          >
                            Closed
                          </Badge>
                        </Flex>
                      </Box>
                      <Box mt={4}>
                        <InputField name='due' type='date' label='Due' />
                      </Box>
                      <Box mt={4}>
                        <Flex justifyContent={'space-between'}>
                          <Text fontSize={'md'} fontWeight={'medium'}>
                            Assigned to
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
                          {issue.assignedUsers?.map((u) => (
                            <Badge
                              colorScheme={'pink'}
                              variant={'solid'}
                              color={'white'}
                              px={2}
                              py={1}
                              ml={2}
                              mb={2}
                              key={u.id}
                            >
                              <Flex align={'center'}>
                                <Text>{u.username}</Text>
                                <IconButton
                                  aria-label='Delete assigned user'
                                  colorScheme={'pink'}
                                  icon={<CloseIcon />}
                                  size={'xs'}
                                  ml={2}
                                  onClick={() => {
                                    const usersAfterDeletion =
                                      assignedUsers.filter((au) => au !== u.id);

                                    updateIssue({
                                      variables: {
                                        id: issue.id,
                                        title: issue.title,
                                        status,
                                        assignedUsers: usersAfterDeletion,
                                      },
                                      update: (cache, { data }) => {
                                        console.log(cache);
                                      },
                                    });
                                  }}
                                />
                              </Flex>
                            </Badge>
                          ))}
                        </Flex>
                        {showUserList && data?.users.length ? (
                          <Box maxH={'200px'} overflowY={'auto'} mt={4}>
                            <List spacing={3}>
                              {data.users.map((u) => {
                                if (usersToShow.includes(u.id)) {
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
                                          assignedUsers.push(u.id);
                                          updateIssue({
                                            variables: {
                                              id: issue.id,
                                              title: issue.title,
                                              status,
                                              assignedUsers,
                                            },
                                          });
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
                        ) : null}
                      </Box>
                      <ModalFooter>
                        <Button
                          isLoading={isSubmitting}
                          colorScheme='blue'
                          type='submit'
                        >
                          Update
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
