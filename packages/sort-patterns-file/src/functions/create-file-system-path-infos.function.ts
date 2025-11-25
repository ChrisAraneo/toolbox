import { lstatSync } from 'node:fs';
import { normalize } from 'node:path';

import { FileSystemPathInfo } from 'src/interfaces/file-system-path-info.interface';

export const createFileSystemPathInfos = (
  paths: string[],
): FileSystemPathInfo[] =>
  paths
    .map((path) => path.trim())
    .filter(Boolean)
    .map((path) => normalize(path))
    .map((path) => ({
      path,
      isDirectory: lstatSync(path).isDirectory(),
      isFile: lstatSync(path).isFile(),
    }));
