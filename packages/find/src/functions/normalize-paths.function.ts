import { map } from 'lodash';
import { normalize } from 'path';

/**
 * Normalizes an array of paths
 */
export const normalizePaths =
  (rootDir?: string) =>
  (paths: readonly string[]): string[] =>
    map(paths, (path) => normalize(`${rootDir ? `${rootDir}/` : ''}${path}`));
