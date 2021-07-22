export const toDate = (ms: string) => {
  return new Date(Number(ms)).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
