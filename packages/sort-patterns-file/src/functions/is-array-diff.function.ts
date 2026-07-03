import { find, isUndefined } from 'lodash-es';

export const isArrayDiff = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return true;
  }

  return !isUndefined(find(a, (value, index) => value !== b[index]));
};
