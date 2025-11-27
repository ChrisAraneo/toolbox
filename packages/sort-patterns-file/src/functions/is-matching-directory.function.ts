// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const { minimatch } = require('minimatch');

export const isMatchingDirectory = (
  pattern: string,
  directory: string,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
): boolean => minimatch(directory, pattern);
