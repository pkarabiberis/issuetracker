export const toDate = (ms: string) => {
  if (ms.includes('NaN')) {
    return '-';
  }
  return new Date(Number(ms)).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
