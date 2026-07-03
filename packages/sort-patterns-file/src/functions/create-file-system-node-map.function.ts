import { assign, isEmpty, reduce, trim } from 'lodash-es';
import { match } from 'ts-pattern';

import { FileSystemNode } from '../interfaces/file-system-node.interface';
import { FileSystemPathInfo } from '../interfaces/file-system-path-info.interface';
import { getParentDirectory } from './get-parent-directory.function';

const toDirectoryEntry = (path: string): FileSystemNode => ({
  name: trim(path),
  parentDirectory: getParentDirectory(path),
  files: [],
});

const toFileEntry = (
  previous: FileSystemNode | undefined,
  parentDirectory: string,
  filePath: string,
): FileSystemNode => ({
  ...previous,
  name: parentDirectory,
  parentDirectory: getParentDirectory(parentDirectory),
  files: [...(previous?.files ?? []), filePath],
});

const toPatch = (
  directories: Record<string, FileSystemNode>,
  item: FileSystemPathInfo,
): Record<string, FileSystemNode> =>
  match(item)
    .with(
      { isDirectory: true },
      ({ path }) => isEmpty(directories[path]),
      ({ path }) => ({ [path]: toDirectoryEntry(path) }),
    )
    .with({ isFile: true }, ({ path }) => {
      const parentDirectory = getParentDirectory(path);

      return {
        [parentDirectory]: toFileEntry(
          directories[parentDirectory],
          parentDirectory,
          path,
        ),
      };
    })
    .otherwise(() => ({}));

export const createFileSystemNodeMap = (
  infos: FileSystemPathInfo[],
): Record<string, FileSystemNode> =>
  reduce<FileSystemPathInfo, Record<string, FileSystemNode>>(
    infos,
    (directories, item) =>
      assign(directories, toPatch(directories, item)),
    {},
  );
