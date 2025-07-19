export function appendNewPatterns(
  targetArray: string[],
  patterns: string[],
): void {
  for (const pattern of patterns) {
    if (Boolean(pattern) && !targetArray.find((p) => p === pattern)) {
      targetArray.push(pattern);
    }
  }
}
