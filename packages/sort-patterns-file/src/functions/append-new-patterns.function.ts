export const appendNewPatterns = (
  targetArray: string[],
  patterns: string[],
): void => {
  patterns.forEach((pattern) => {
    if (Boolean(pattern) && !targetArray.includes(pattern)) {
      targetArray.push(pattern);
    }
  });
};
