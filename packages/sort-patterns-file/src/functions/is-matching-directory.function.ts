import { minimatch } from 'minimatch';

export function isMatchingDirectory(
  pattern: string,
  directory: string,
): boolean {
  return minimatch(directory, pattern);
}
