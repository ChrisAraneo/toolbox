import { filter, forEach, map } from 'lodash-es';

import { FileSystemNode } from '../interfaces/file-system-node.interface';
import { getSortedKeys } from './get-sorted-keys.function';

export const createOrganizedFileSystemNodeArray = (
  directories: Record<string, FileSystemNode>,
): FileSystemNode[] => {
  const result: FileSystemNode[] = [];

  const keys = getSortedKeys(directories);

  forEach(
    filter(keys, (item) => item !== '.'),
    (key) => {
      const item = directories[key];

      // Left as native Array.prototype.sort: lodash's sortBy does not accept a
      // Custom comparator (no localeCompare equivalent) and does not mutate
      // In place, so it isn't a behavior-preserving replacement here.
      item.files.sort((a, b) => a.localeCompare(b));

      result.push({
        name: key.trim(),
        parentDirectory: item.parentDirectory?.trim() ?? null,
        files: map(item.files, (file) => file.trim()),
      });
    },
  );

  result.push({
    name: '.',
    parentDirectory: null,
    files: directories['.'].files,
  });

  return result;
};
