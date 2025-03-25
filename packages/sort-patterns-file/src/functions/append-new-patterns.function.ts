export function appendNewPatterns(
  targetArray: string[],
  patterns: string[],
): void {
  patterns.forEach((pattern) => {
    if (!!pattern && !targetArray.find((p) => p === pattern)) {
      targetArray.push(pattern);
    }
  });
}
