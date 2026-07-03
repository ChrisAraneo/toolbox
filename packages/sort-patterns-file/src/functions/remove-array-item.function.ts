import { indexOf, pullAt } from 'lodash-es';

export const removeArrayItem = (array: string[], item: string): void => {
  const index = indexOf(array, item);

  if (index !== -1) {
    pullAt(array, index);
  }
};
