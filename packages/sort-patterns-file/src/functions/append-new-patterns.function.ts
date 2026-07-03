import { chain, includes } from 'lodash-es';

export const appendNewPatterns = (
  targetArray: string[],
  patterns: string[],
): void => {
  targetArray.push(
    ...chain(patterns)
      .filter(Boolean)
      .uniq()
      .filter((pattern) => !includes(targetArray, pattern))
      .value(),
  );
};
