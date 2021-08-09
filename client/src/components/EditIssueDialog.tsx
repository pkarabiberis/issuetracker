import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Collapse,
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
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import {
  Issue,
  useDeleteIssueMutation,
  useUpdateIssueMutation,
  useUserQuery,
} from '../generated/graphql';
import { getInitialDate } from '../utils/getInitialDate';
import { scrollbarStyle } from '../utils/scrollbarStyle';
import { toDate } from '../utils/toDate';
import { useGetProjectFromUrl } from '../utils/useGetProjectFromUrl';
import { useModalSize } from '../utils/useModalSize';
import { InputField } from './InputField';
import { PrimaryButton } from './PrimaryButton';

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
  const [status, setStatus] = useState<string>(issue.status);
  const [showUserList, setShowUserList] = useState(false);
  const [updateIssue] = useUpdateIssueMutation();
  const { data } = useGetProjectFromUrl();
  const { data: issueCreator } = useUserQuery({
    variables: {
      userId: issue.creatorId,
    },
  });
  const [deleteIssue, { loading: deleteLoading }] = useDeleteIssueMutation();

  const assignedUsers: number[] = [];
  const usersToShow: number[] = [];
  let disableUserClick = false;

  issue?.assignedUsers?.forEach((u) => assignedUsers.push(u.id));
  data?.project?.project.users?.forEach((user) => {
    if (!assignedUsers.includes(user.id)) {
      usersToShow.push(user.id);
    }
  });

  const open = () => {
    if (usersToShow.length) {
      setShowUserList(!showUserList);
    }
  };

  useEffect(() => {
    if (!usersToShow.length) {
      setShowUserList(false);
    }
  }, [usersToShow]);

  return (
    <>
      <Modal
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        autoFocus={false}
        size={useModalSize()}
      >
        <ModalOverlay />
        <ModalContent mx={[2, 2, 0, 0, 0, 0]}>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                title: issue.title,
                due: issue.due ? getInitialDate(issue.due) : '',
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
                  <Box mx={'auto'} maxW={'400px'}>
                    <Text color={'#361d32'} fontSize={20} fontWeight={'bold'}>
                      Edit issue
                    </Text>
                    <Text fontWeight={300} fontSize={14}>
                      Created at {toDate(issue.createdAt)}
                    </Text>
                    <Flex>
                      <Text fontWeight={300} fontSize={14}>
                        by
                      </Text>
                      <Text
                        ml={1}
                        fontWeight={'bold'}
                        fontSize={14}
                        color={'#361d32'}
                      >
                        {issueCreator?.user.user?.username}
                      </Text>
                    </Flex>
                    <Form style={{ marginTop: '24px' }}>
                      <InputField name="title" label="Issue" />
                      <Box mt={4}>
                        <Text fontSize={'md'} fontWeight={'medium'}>
                          Status
                        </Text>
                        <Flex mt={2}>
                          <Badge
                            onClick={() => setStatus('Ongoing')}
                            p={2}
                            ml={2}
                            colorScheme="purple"
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
                            colorScheme="green"
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
                            colorScheme="red"
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
                        <InputField name="due" type="date" label="Due" />
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
                            as={
                              showUserList
                                ? AiOutlineUserDelete
                                : AiOutlineUserAdd
                            }
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
                                  aria-label="Delete assigned user"
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
                                    });
                                  }}
                                />
                              </Flex>
                            </Badge>
                          ))}
                        </Flex>
                        <Collapse in={showUserList} animateOpacity>
                          {data?.project?.project.users &&
                          data.project.project.users.length >= 1 ? (
                            <Box
                              sx={scrollbarStyle()}
                              maxH={'200px'}
                              overflowY={'auto'}
                              mt={4}
                            >
                              <List spacing={3}>
                                {data.project.project.users.map((u) => {
                                  if (usersToShow.includes(u.id)) {
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
                                              aria-label="Add user"
                                              size={'xs'}
                                              disabled={disableUserClick}
                                              bgColor={'white'}
                                              icon={<AddIcon />}
                                              onClick={async () => {
                                                disableUserClick = true;
                                                assignedUsers.push(u.id);
                                                await updateIssue({
                                                  variables: {
                                                    id: issue.id,
                                                    title: issue.title,
                                                    status,
                                                    assignedUsers,
                                                  },
                                                });

                                                disableUserClick = false;
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
                          ) : null}
                        </Collapse>
                      </Box>
                      <ModalFooter
                        justifyContent={'space-between'}
                        p={0}
                        mt={5}
                      >
                        <Button
                          isLoading={deleteLoading}
                          colorScheme="red"
                          onClick={async () => {
                            onClose();
                            await deleteIssue({
                              variables: {
                                id: issue.id,
                              },
                              update: (cache) => {
                                cache.evict({ id: 'Issue:' + issue.id });
                              },
                            });
                          }}
                        >
                          Delete
                        </Button>
                        <PrimaryButton
                          buttonText={'Update'}
                          type={'submit'}
                          isLoading={isSubmitting}
                        />
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
