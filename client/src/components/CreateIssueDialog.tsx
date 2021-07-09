import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import {
  ProjectDocument,
  ProjectQuery,
  useCreateIssueMutation,
} from '../generated/graphql';
import { InputField } from './InputField';

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
                await createIssue({
                  variables: {
                    input: {
                      title: values.title,
                      due: new Date(values.due).getTime().toString(),
                      projectId: projectId!,
                    },
                    assignedUsers: [9, 10],
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
