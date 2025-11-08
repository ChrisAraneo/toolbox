export const appendNewPatterns = (
  targetArray: string[],
  patterns: string[],
): void => {
  for (const pattern of patterns) {
    if (Boolean(pattern) && !targetArray.includes(pattern)) {
      targetArray.push(pattern);
    }
  }
};
