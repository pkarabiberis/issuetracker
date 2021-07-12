export const toDate = (ms: string) => {
  return new Date(Number(ms)).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
