import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { NavBar } from '../components/NavBar';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Box height='100%'>
      <NavBar />
      <Flex mt={10}>
        <Flex m='auto' alignItems='center'>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (creds, { setErrors }) => {
              const response = await login({
                variables: {
                  creds,
                },
              });
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
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
                      name='username'
                      placeholder='username'
                      label='Username'
                    />

                    <Box mt={4}>
                      <InputField
                        name='password'
                        label='Password'
                        placeholder='********'
                        type='password'
                      />
                    </Box>
                    <Flex>
                      <Button
                        mt={4}
                        ml={'auto'}
                        type='submit'
                        textColor={'white'}
                        isLoading={isSubmitting}
                        bgColor='blue.500'
                        _hover={{ bgColor: 'blue.400' }}
                      >
                        Login
                      </Button>
                    </Flex>
                  </Form>
                </Box>
              );
            }}
          </Formik>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Login;
