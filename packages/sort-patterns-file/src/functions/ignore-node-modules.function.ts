export const ignoreNodeModules = (patterns: string[]): string[] =>
  patterns.filter((pattern) => pattern !== 'node_modules');
