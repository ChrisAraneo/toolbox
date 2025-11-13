/* eslint-disable @typescript-eslint/no-magic-numbers */

export const removeArrayItem = (array: string[], item: string): void => {
  const index = array.indexOf(item);

  if (index !== -1) {
    array.splice(index, 1);
  }
};
