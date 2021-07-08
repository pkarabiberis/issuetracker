export const getBadgeColor = (status: string) => {
  if (status === 'Ongoing') {
    return 'purple';
  } else if (status === 'Completed') {
    return 'green';
  } else {
    return 'red';
  }
};
