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
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import {
  useCreateProjectMutation,
  UserProjectsDocument,
  UserProjectsQuery,
} from '../generated/graphql';
import { InputField } from './InputField';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [createProject, { loading }] = useCreateProjectMutation();
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
                await createProject({
                  variables: {
                    name: name.projectName,
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
                      <InputField name='projectName' label='Project name' />
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
