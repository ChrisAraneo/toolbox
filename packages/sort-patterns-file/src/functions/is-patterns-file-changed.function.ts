import { isUndefined } from 'lodash';

export const isPatternsFileChanged = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return true;
  }

  return !isUndefined(a.find((value, index) => value !== b[index]));
};
