import { lstatSync } from 'node:fs';
import { normalize } from 'node:path';

import { chain } from 'lodash-es';

import { FileSystemPathInfo } from '../interfaces/file-system-path-info.interface';

export const createFileSystemPathInfos = (
  paths: string[],
): FileSystemPathInfo[] => chain(paths)
    .map((path) => path.trim())
    .filter(Boolean)
    .map((path) => normalize(path))
    .map((path) => {
      let isFile: boolean;
      let isDirectory: boolean;

      try {
        isFile = lstatSync(path).isFile();
        isDirectory = lstatSync(path).isDirectory();
      } catch {
        // If there is error, we skip the path.
        isFile = false;
        isDirectory = false;
      }

      return {
        path,
        isDirectory,
        isFile,
      };
    })
    .value();
