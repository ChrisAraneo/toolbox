import { forEach, includes } from 'lodash-es';

export const appendNewPatterns = (
  targetArray: string[],
  patterns: string[],
): void => {
  forEach(patterns, (pattern) => {
    if (Boolean(pattern) && !includes(targetArray, pattern)) {
      targetArray.push(pattern);
    }
  });
};
