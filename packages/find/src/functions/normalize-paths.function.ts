import { normalize } from 'node:path';

import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

const toRootPrefix = (rootDir?: string): string => match(rootDir)
    .with(when(Boolean), (dir) => `${dir}/`)
    .otherwise(() => '');

/**
 * Normalizes an array of paths
 */
export const normalizePaths =
  (rootDir?: string) => (paths: readonly string[]): string[] => map(paths, (path) => normalize(`${toRootPrefix(rootDir)}${path}`));
