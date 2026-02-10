const { minimatch } = require('minimatch');

export const isMatchingDirectory = (
  pattern: string,
  directory: string,
): boolean => minimatch(directory, pattern);
