import { FileSystemNode } from 'src/interfaces/file-system-node.interface';

import { getSortedKeys } from './get-sorted-keys.function';

export const createOrganizedFileSystemNodeArray = (
  directories: Record<string, FileSystemNode>,
): FileSystemNode[] => {
  const result: FileSystemNode[] = [];

  const keys = getSortedKeys(directories);

  keys
    .filter((item) => item !== '.')
    .forEach((key) => {
      const item = directories[key];

      item.files.sort((a, b) => a.localeCompare(b));

      result.push({
        name: key.trim(),
        parentDirectory: item.parentDirectory?.trim() ?? null,
        files: item.files.map((file) => file.trim()),
      });
    });

  result.push({
    name: '.',
    parentDirectory: null,
    files: directories['.'].files,
  });

  return result;
};
