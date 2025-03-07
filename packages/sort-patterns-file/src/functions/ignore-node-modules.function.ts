export function ignoreNodeModules(patterns: string[]): string[] {
  return patterns.filter((pattern) => pattern !== 'node_modules');
}
