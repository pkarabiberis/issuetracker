export const getInitialDate = (due?: string) => {
  const issueDue = new Date(Number(due));

  //insert zero to initial value if needed
  //for input type="date"
  const initialMonth =
    issueDue.getMonth() + 1 < 10
      ? `0${(issueDue.getMonth() + 1).toString()}`
      : `${(issueDue.getMonth() + 1).toString()}`;

  return `${issueDue.getFullYear().toString()}-${initialMonth}-${issueDue
    .getDate()
    .toString()}`;
};
