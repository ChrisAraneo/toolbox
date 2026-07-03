import { normalize } from 'node:path';

import { map } from 'lodash-es';

/**
 * Normalizes an array of paths
 */
export const normalizePaths =
  (rootDir?: string) => (paths: readonly string[]): string[] => map(paths, (path) => normalize(`${rootDir ? `${rootDir}/` : ''}${path}`));
