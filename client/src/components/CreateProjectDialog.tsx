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
import React, { useState } from 'react';
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import {
  ProjectsDocument,
  ProjectsQuery,
  useCreateProjectMutation,
  useCurrentUserQuery,
  UserProjectsDocument,
  UserProjectsQuery,
  useUsersQuery,
} from '../generated/graphql';
import { scrollbarStyle } from '../utils/scrollbarStyle';
import { useModalSize } from '../utils/useModalSize';
import { InputField } from './InputField';
import { PrimaryButton } from './PrimaryButton';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fromIndexPage: boolean;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  isOpen,
  onClose,
  fromIndexPage,
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
      <Modal
        returnFocusOnClose={false}
        autoFocus={false}
        isOpen={isOpen}
        onClose={onClose}
        size={useModalSize()}
      >
        <ModalOverlay />
        <ModalContent mx={[2, 2, 0, 0, 0, 0]}>
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
                    if (!fromIndexPage) {
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
                    } else {
                      const existingProjects: ProjectsQuery | null =
                        cache.readQuery({
                          query: ProjectsDocument,
                        });
                      cache.writeQuery<ProjectsQuery>({
                        query: ProjectsDocument,
                        data: {
                          projects: {
                            __typename: 'ProjectResponse',
                            projects: [
                              newProjectData!.createProject,
                              ...(existingProjects?.projects?.projects || []),
                            ],
                          },
                        },
                      });
                    }
                  },
                });
                onClose();
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Box maxW={'400px'} mx={'auto'}>
                    <Text color={'#361d32'} fontSize={20} fontWeight={'bold'}>
                      Create project
                    </Text>
                    <Form style={{ marginTop: '24px' }}>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
