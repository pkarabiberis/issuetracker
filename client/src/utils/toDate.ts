export const toDate = (ms: string) => {
  console.log(ms);
  return new Date(Number(ms)).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
