import { Project } from '../generated/graphql';

export const membersAmount = (users?: Project['users']) => {
  if (!users) {
    return '-';
  }

  if (users.length === 1) {
    return users[0].username;
  }

  if (users.length === 2) {
    return `${users[0].username} and 1 other`;
  }

  return `${users[0].username} and ${users.length - 1}  others`;
};
