export const isArrayDiff = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return true;
  }

  let isDiff = false;

  for (let i = 0; i < a.length && !isDiff; i++) {
    if (a[i] !== b[i]) {
      isDiff = true;
    }
  }

  return isDiff;
};
