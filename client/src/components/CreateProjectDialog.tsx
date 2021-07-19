import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Flex,
  Badge,
  Icon,
  IconButton,
  Collapse,
  List,
  ListItem,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { useState } from 'react';
import { AiOutlineUserDelete, AiOutlineUserAdd } from 'react-icons/ai';
import {
  useCreateProjectMutation,
  useCurrentUserQuery,
  UserProjectsDocument,
  UserProjectsQuery,
  useUsersQuery,
} from '../generated/graphql';
import { scrollbarStyle } from '../utils/scrollbarStyle';
import { InputField } from './InputField';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [createProject] = useCreateProjectMutation();
  const { data: meData } = useCurrentUserQuery();
  const [showUserList, setShowUserList] = useState(false);
  const { data } = useUsersQuery();
  const [usersToAssign, setUsersToAssign] = useState<
    { id: number; username: string }[]
  >([]);
  const open = () => {
    setShowUserList(!showUserList);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ projectName: '' }}
              onSubmit={async (name, { setErrors }) => {
                const idsToAssign = usersToAssign.map(({ id }) => id);
                await createProject({
                  variables: {
                    name: name.projectName,
                    users: [
                      ...idsToAssign,
                      typeof meData?.currentUser?.id !== 'undefined'
                        ? meData.currentUser?.id
                        : -1,
                    ],
                  },
                  update: (cache, { data: newProjectData }) => {
                    const existingProjects: UserProjectsQuery | null =
                      cache.readQuery({
                        query: UserProjectsDocument,
                      });
                    cache.writeQuery({
                      query: UserProjectsDocument,
                      data: {
                        userProjects: [
                          newProjectData!.createProject,
                          ...(existingProjects?.userProjects || []),
                        ],
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
                      <InputField name="projectName" label="Project name" />
                      <Box mt={4}>
                        <Flex justifyContent={'space-between'}>
                          <Text fontSize={'md'} fontWeight={'medium'}>
                            Users
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
                                    aria-label="Delete assigned user"
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
                            {data?.users &&
                              data.users.map((u) => {
                                const isUserAssigned = usersToAssign.find(
                                  (e) => e.id === u.id
                                );
                                if (
                                  !isUserAssigned &&
                                  u.id !== meData?.currentUser?.id
                                ) {
                                  return (
                                    <ListItem key={u.id}>
                                      <Badge
                                        colorScheme={'whiteAlpha'}
                                        variant={'solid'}
                                        color={'black'}
                                        p={1}
                                        onClick={() => {}}
                                      >
                                        <Flex alignItems={'center'}>
                                          <Text>{u.username}</Text>
                                          <IconButton
                                            ml={2}
                                            aria-label="Add user"
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
                        <Button
                          isLoading={isSubmitting}
                          colorScheme="blue"
                          type="submit"
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
