import {
  Badge,
  Box,
  Button,
  Flex,
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
import {
  Issue,
  ProjectDocument,
  ProjectQuery,
  useUpdateIssueMutation,
} from '../generated/graphql';
import { InputField } from './InputField';

interface EditIssueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: any;
}

export const EditIssueDialog: React.FC<EditIssueDialogProps> = ({
  isOpen,
  onClose,
  issue,
}) => {
  const realIssue = issue as Issue;
  const [status, setStatus] = useState(realIssue.status);
  const [updateIssue, { loading, error }] = useUpdateIssueMutation();
  const assignedUsers: number[] = [];
  realIssue?.assignedUsers?.forEach((u) => assignedUsers.push(u.id));
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
                title: realIssue.title,
              }}
              onSubmit={async (title, { setErrors }) => {
                const res = await updateIssue({
                  variables: {
                    id: realIssue.id,
                    title: title.title,
                    status,
                    assignedUsers,
                  },
                });

                console.log(res);
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
                        <Text fontSize={'md'} fontWeight={'medium'}>
                          Assigned to
                        </Text>
                        <Flex mt={2}>
                          {realIssue.assignedUsers?.map((u, i) => (
                            <Badge p={2} mx={i !== 0 ? '4' : '0'} key={u.id}>
                              {u.username}
                            </Badge>
                          ))}
                        </Flex>
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