import { Box, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  CurrentUserDocument,
  CurrentUserQuery,
  useLoginMutation,
} from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (creds, { setErrors }) => {
          const response = await login({
            variables: {
              creds,
            },
            update: (cache, { data }) => {
              cache.writeQuery<CurrentUserQuery>({
                query: CurrentUserDocument,
                data: {
                  __typename: 'Query',
                  currentUser: data?.login?.user,
                },
              });
            },
          });
          if (response.data?.login?.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Box
              px={4}
              w={['320px', '320px', '400px', '400px', '400px', '400px']}
            >
              <Form>
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />

                <Box mt={4}>
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="********"
                    type="password"
                  />
                </Box>
                <Flex>
                  <PrimaryButton
                    mt={4}
                    ml={'auto'}
                    type="submit"
                    isLoading={isSubmitting}
                    buttonText={'Login'}
                  />
                </Flex>
              </Form>
            </Box>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
