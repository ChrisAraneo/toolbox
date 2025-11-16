import { minimatch } from 'minimatch';

export const isMatchingDirectory = (
  pattern: string,
  directory: string,
): boolean => minimatch(directory, pattern);
