import { isEmpty, reduce } from 'lodash-es';

import { FileSystemNode } from '../interfaces/file-system-node.interface';
import { FileSystemPathInfo } from '../interfaces/file-system-path-info.interface';
import { getParentDirectory } from './get-parent-directory.function';

export const createFileSystemNodeMap = (
  infos: FileSystemPathInfo[],
): Record<string, FileSystemNode> =>
  reduce<FileSystemPathInfo, Record<string, FileSystemNode>>(
    infos,
    (directories, item) => {
      const parentDirectory = getParentDirectory(item.path);

      if (item.isDirectory && isEmpty(directories[item.path])) {
        directories[item.path] = {
          name: item.path.trim(),
          parentDirectory,
          files: [],
        };
      } else if (item.isFile) {
        const isParentDirectoryEmpty = isEmpty(directories[parentDirectory]);
        const previousFileSystemNode = isParentDirectoryEmpty
          ? {}
          : directories[parentDirectory];
        const previousFiles = isParentDirectoryEmpty
          ? []
          : directories[parentDirectory].files;

        directories[parentDirectory] = {
          ...previousFileSystemNode,
          name: parentDirectory,
          parentDirectory: getParentDirectory(parentDirectory),
          files: [...previousFiles, item.path],
        };
      }

      return directories;
    },
    {},
  );
