import { InputError } from '../generated/graphql';

export const toErrorMap = (errors: InputError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach((err) => {
    errorMap[err.field] = err.message;
  });

  return errorMap;
};
