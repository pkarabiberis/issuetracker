import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Layout>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (creds, { setErrors }) => {
          const response = await register({
            variables: {
              creds,
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Box w={'400px'}>
              <Form>
                <InputField
                  name="email"
                  placeholder="your@email.com"
                  label="Email"
                />
                <Box mt={4}>
                  <InputField
                    name="username"
                    placeholder="username"
                    label="Username"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="********"
                    type="password"
                  />
                </Box>
                <Flex>
                  <Button
                    mt={4}
                    ml={'auto'}
                    type="submit"
                    textColor={'white'}
                    isLoading={isSubmitting}
                    bgColor="blue.500"
                    _hover={{ bgColor: 'blue.400' }}
                  >
                    Register
                  </Button>
                </Flex>
              </Form>
            </Box>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default Register;
