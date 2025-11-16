export const getSortedKeys = (object: object): string[] => {
  const keys = Object.keys(object);

  keys.sort((a, b) => a.localeCompare(b));

  return keys;
};
