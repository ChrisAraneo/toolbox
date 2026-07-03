import { lstatSync } from 'node:fs';
import { normalize } from 'node:path';

import { chain } from 'lodash-es';
import { tryCatch } from 'ramda';

import { FileSystemPathInfo } from '../interfaces/file-system-path-info.interface';

// If there is error, we skip the path.
const toFileStat = tryCatch(
  (path: string) => ({
    isFile: lstatSync(path).isFile(),
    isDirectory: lstatSync(path).isDirectory(),
  }),
  () => ({ isFile: false, isDirectory: false }),
);

export const createFileSystemPathInfos = (
  paths: string[],
): FileSystemPathInfo[] =>
  chain(paths)
    .map((path) => path.trim())
    .filter(Boolean)
    .map((path) => normalize(path))
    .map((path) => ({ path, ...toFileStat(path) }))
    .value();
