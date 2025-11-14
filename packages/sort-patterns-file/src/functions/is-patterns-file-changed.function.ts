export const isPatternsFileChanged = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return true;
  }

  let isChanged = false;

  for (let i = 0; i < a.length && !isChanged; i++) {
    if (a[i] !== b[i]) {
      isChanged = true;
    }
  }

  return isChanged;
};
