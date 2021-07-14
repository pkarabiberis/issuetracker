import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type InputError = {
  __typename?: 'InputError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Issue = {
  __typename?: 'Issue';
  id: Scalars['Int'];
  title: Scalars['String'];
  creatorId: Scalars['Int'];
  due?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  assignedUsers?: Maybe<Array<User>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type IssueInput = {
  title: Scalars['String'];
  due?: Maybe<Scalars['String']>;
  projectId: Scalars['Float'];
};

export type IssueResponse = {
  __typename?: 'IssueResponse';
  issue?: Maybe<Issue>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<UserResponse>;
  login?: Maybe<UserResponse>;
  logout: Scalars['Boolean'];
  createProject: Project;
  createIssue: Issue;
  updateissue: Issue;
};


export type MutationRegisterArgs = {
  creds: UserRegisterInput;
};


export type MutationLoginArgs = {
  creds: UserLoginInput;
};


export type MutationCreateProjectArgs = {
  name: Scalars['String'];
};


export type MutationCreateIssueArgs = {
  assignedUsers: Array<Scalars['Int']>;
  input: IssueInput;
};


export type MutationUpdateissueArgs = {
  assignedUsers: Array<Scalars['Int']>;
  due?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['Int'];
  name: Scalars['String'];
  creatorId: Scalars['Int'];
  users?: Maybe<Array<User>>;
  issues: Array<Issue>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ProjectResponse = {
  __typename?: 'ProjectResponse';
  project: Project;
  issues: Array<Issue>;
};

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  currentUser?: Maybe<User>;
  userProjects?: Maybe<Array<Project>>;
  project?: Maybe<ProjectResponse>;
  issue: IssueResponse;
};


export type QueryProjectArgs = {
  sortDir?: Maybe<Scalars['String']>;
  sortBy?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};


export type QueryIssueArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  issues?: Maybe<Array<Issue>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserLoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UserRegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<InputError>>;
};

export type CreateIssueMutationVariables = Exact<{
  input: IssueInput;
  assignedUsers: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CreateIssueMutation = (
  { __typename?: 'Mutation' }
  & { createIssue: (
    { __typename?: 'Issue' }
    & Pick<Issue, 'id' | 'title' | 'creatorId' | 'due' | 'status' | 'createdAt' | 'updatedAt'>
    & { assignedUsers?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
    )>> }
  ) }
);

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'creatorId' | 'createdAt' | 'updatedAt'>
    & { users?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
    )>> }
  ) }
);

export type LoginMutationVariables = Exact<{
  creds: UserLoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'InputError' }
      & Pick<InputError, 'field' | 'message'>
    )>> }
  )> }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  creds: UserRegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'InputError' }
      & Pick<InputError, 'field' | 'message'>
    )>> }
  )> }
);

export type UpdateIssueMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  status: Scalars['String'];
  due?: Maybe<Scalars['String']>;
  assignedUsers: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type UpdateIssueMutation = (
  { __typename?: 'Mutation' }
  & { updateissue: (
    { __typename?: 'Issue' }
    & Pick<Issue, 'id' | 'title' | 'creatorId' | 'due' | 'status' | 'createdAt' | 'updatedAt' | 'projectId'>
    & { assignedUsers?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
    )>> }
  ) }
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
  )> }
);

export type IssueQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type IssueQuery = (
  { __typename?: 'Query' }
  & { issue: (
    { __typename?: 'IssueResponse' }
    & { issue?: Maybe<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'id' | 'title' | 'creatorId' | 'due' | 'projectId' | 'status' | 'createdAt' | 'updatedAt'>
      & { assignedUsers?: Maybe<Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
      )>> }
    )> }
  ) }
);

export type ProjectQueryVariables = Exact<{
  id: Scalars['Int'];
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'ProjectResponse' }
    & { project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'name' | 'creatorId' | 'createdAt' | 'updatedAt'>
      & { users?: Maybe<Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
      )>> }
    ), issues: Array<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'id' | 'title' | 'creatorId' | 'due' | 'status' | 'createdAt' | 'updatedAt' | 'projectId'>
      & { assignedUsers?: Maybe<Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
      )>> }
    )> }
  )> }
);

export type UserProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProjectsQuery = (
  { __typename?: 'Query' }
  & { userProjects?: Maybe<Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'creatorId' | 'createdAt' | 'updatedAt'>
    & { users?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
    )>> }
  )>> }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
  )> }
);


export const CreateIssueDocument = gql`
    mutation CreateIssue($input: IssueInput!, $assignedUsers: [Int!]!) {
  createIssue(input: $input, assignedUsers: $assignedUsers) {
    id
    title
    creatorId
    due
    status
    createdAt
    updatedAt
    assignedUsers {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreateIssueMutationFn = Apollo.MutationFunction<CreateIssueMutation, CreateIssueMutationVariables>;

/**
 * __useCreateIssueMutation__
 *
 * To run a mutation, you first call `useCreateIssueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateIssueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createIssueMutation, { data, loading, error }] = useCreateIssueMutation({
 *   variables: {
 *      input: // value for 'input'
 *      assignedUsers: // value for 'assignedUsers'
 *   },
 * });
 */
export function useCreateIssueMutation(baseOptions?: Apollo.MutationHookOptions<CreateIssueMutation, CreateIssueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateIssueMutation, CreateIssueMutationVariables>(CreateIssueDocument, options);
      }
export type CreateIssueMutationHookResult = ReturnType<typeof useCreateIssueMutation>;
export type CreateIssueMutationResult = Apollo.MutationResult<CreateIssueMutation>;
export type CreateIssueMutationOptions = Apollo.BaseMutationOptions<CreateIssueMutation, CreateIssueMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($name: String!) {
  createProject(name: $name) {
    id
    name
    creatorId
    createdAt
    updatedAt
    users {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const LoginDocument = gql`
    mutation Login($creds: UserLoginInput!) {
  login(creds: $creds) {
    user {
      id
      username
      email
      createdAt
      updatedAt
    }
    errors {
      field
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      creds: // value for 'creds'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($creds: UserRegisterInput!) {
  register(creds: $creds) {
    user {
      id
      username
      email
      createdAt
      updatedAt
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      creds: // value for 'creds'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UpdateIssueDocument = gql`
    mutation UpdateIssue($id: Int!, $title: String!, $status: String!, $due: String, $assignedUsers: [Int!]!) {
  updateissue(
    id: $id
    title: $title
    status: $status
    due: $due
    assignedUsers: $assignedUsers
  ) {
    id
    title
    creatorId
    due
    status
    createdAt
    updatedAt
    projectId
    assignedUsers {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateIssueMutationFn = Apollo.MutationFunction<UpdateIssueMutation, UpdateIssueMutationVariables>;

/**
 * __useUpdateIssueMutation__
 *
 * To run a mutation, you first call `useUpdateIssueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIssueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIssueMutation, { data, loading, error }] = useUpdateIssueMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      status: // value for 'status'
 *      due: // value for 'due'
 *      assignedUsers: // value for 'assignedUsers'
 *   },
 * });
 */
export function useUpdateIssueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIssueMutation, UpdateIssueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIssueMutation, UpdateIssueMutationVariables>(UpdateIssueDocument, options);
      }
export type UpdateIssueMutationHookResult = ReturnType<typeof useUpdateIssueMutation>;
export type UpdateIssueMutationResult = Apollo.MutationResult<UpdateIssueMutation>;
export type UpdateIssueMutationOptions = Apollo.BaseMutationOptions<UpdateIssueMutation, UpdateIssueMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    username
    email
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const IssueDocument = gql`
    query Issue($id: Int!) {
  issue(id: $id) {
    issue {
      id
      title
      creatorId
      due
      projectId
      status
      createdAt
      updatedAt
      assignedUsers {
        id
        username
        email
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useIssueQuery__
 *
 * To run a query within a React component, call `useIssueQuery` and pass it any options that fit your needs.
 * When your component renders, `useIssueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIssueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIssueQuery(baseOptions: Apollo.QueryHookOptions<IssueQuery, IssueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IssueQuery, IssueQueryVariables>(IssueDocument, options);
      }
export function useIssueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IssueQuery, IssueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IssueQuery, IssueQueryVariables>(IssueDocument, options);
        }
export type IssueQueryHookResult = ReturnType<typeof useIssueQuery>;
export type IssueLazyQueryHookResult = ReturnType<typeof useIssueLazyQuery>;
export type IssueQueryResult = Apollo.QueryResult<IssueQuery, IssueQueryVariables>;
export const ProjectDocument = gql`
    query Project($id: Int!, $sortBy: String, $sortDir: String) {
  project(id: $id, sortBy: $sortBy, sortDir: $sortDir) {
    project {
      id
      name
      creatorId
      createdAt
      updatedAt
      users {
        id
        username
        email
        createdAt
        updatedAt
      }
    }
    issues {
      id
      title
      creatorId
      due
      status
      createdAt
      updatedAt
      projectId
      assignedUsers {
        id
        username
        email
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *      sortBy: // value for 'sortBy'
 *      sortDir: // value for 'sortDir'
 *   },
 * });
 */
export function useProjectQuery(baseOptions: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const UserProjectsDocument = gql`
    query UserProjects {
  userProjects {
    id
    name
    creatorId
    createdAt
    updatedAt
    users {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useUserProjectsQuery__
 *
 * To run a query within a React component, call `useUserProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserProjectsQuery(baseOptions?: Apollo.QueryHookOptions<UserProjectsQuery, UserProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserProjectsQuery, UserProjectsQueryVariables>(UserProjectsDocument, options);
      }
export function useUserProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserProjectsQuery, UserProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserProjectsQuery, UserProjectsQueryVariables>(UserProjectsDocument, options);
        }
export type UserProjectsQueryHookResult = ReturnType<typeof useUserProjectsQuery>;
export type UserProjectsLazyQueryHookResult = ReturnType<typeof useUserProjectsLazyQuery>;
export type UserProjectsQueryResult = Apollo.QueryResult<UserProjectsQuery, UserProjectsQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    username
    email
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;