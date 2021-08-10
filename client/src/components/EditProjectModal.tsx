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
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AiOutlineUserDelete, AiOutlineUserAdd } from 'react-icons/ai';
import { useUsersQuery } from '../generated/graphql';
import { scrollbarStyle } from '../utils/scrollbarStyle';
import { useGetProjectFromUrl } from '../utils/useGetProjectFromUrl';
import { BaseModal } from './BaseModal';
import { InputField } from './InputField';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, loading } = useGetProjectFromUrl();
  const { data: userData } = useUsersQuery();
  const [showUserList, setShowUserList] = useState(false);
  const [usersToAssign, setUsersToAssign] = useState<
    { id: number; username: string }[]
  >([]);
  const canToggle =
    userData?.users && userData.users.length !== usersToAssign.length;

  const open = () => {
    if (canToggle) {
      setShowUserList(!showUserList);
    }
  };

  const projectInitialUsers: { id: number; username: string }[] = [];

  useEffect(() => {
    if (!loading && data?.project) {
      data.project?.project.users?.forEach(({ id, username }) => {
        projectInitialUsers.push({ id, username });
      });
    }

    setUsersToAssign(projectInitialUsers);
  }, [data?.project, loading]);

  useEffect(() => {
    if (!canToggle) {
      setShowUserList(false);
    }
  }, [usersToAssign]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Formik
        initialValues={{ projectName: data?.project?.project.name }}
        onSubmit={() => console.log('ye')}
      >
        {({ isSubmitting }) => {
          return (
            <Box mx={'auto'} maxW={'400px'}>
              <Text color={'#361d32'} fontSize={20} fontWeight={'bold'}>
                Update project
              </Text>
              <Form style={{ marginTop: '24px' }}>
                <InputField name='projectName' label='Project name' />
                <Box mt={4}>
                  <Flex justifyContent={'space-between'}>
                    <Text fontSize={'md'} fontWeight={'medium'}>
                      Users
                    </Text>
                    <Icon
                      _hover={{ color: 'gray.500', cursor: 'pointer' }}
                      w={6}
                      h={6}
                      as={showUserList ? AiOutlineUserDelete : AiOutlineUserAdd}
                      onClick={open}
                    />
                  </Flex>
                  <Flex mt={2} align={'center'} wrap={'wrap'}>
                    {usersToAssign.length > 0 &&
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
                                const usersAfterDeletion = usersToAssign.filter(
                                  (au) => au.id !== id
                                );
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
                      {userData?.users &&
                        userData?.users.map((u) => {
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
                                  onClick={() => {}}
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
              </Form>
            </Box>
          );
        }}
      </Formik>
    </BaseModal>
  );
};