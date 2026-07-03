import { chain, map } from 'lodash-es';

import { FileSystemNode } from '../interfaces/file-system-node.interface';
import { getSortedKeys } from './get-sorted-keys.function';

const toOrganizedNode = (
  directories: Record<string, FileSystemNode>,
  key: string,
): FileSystemNode => {
  const item = directories[key];

  // Left as native Array.prototype.sort: lodash's sortBy does not accept a
  // Custom comparator (no localeCompare equivalent) and does not mutate
  // In place, so it isn't a behavior-preserving replacement here.
  item.files.sort((a: string, b: string) => a.localeCompare(b));

  return {
    name: key.trim(),
    parentDirectory: item.parentDirectory?.trim() ?? null,
    files: map(item.files, (file: string) => file.trim()),
  };
};

export const createOrganizedFileSystemNodeArray = (
  directories: Record<string, FileSystemNode>,
): FileSystemNode[] => [
  ...chain(getSortedKeys(directories))
    .filter((key: string) => key !== '.')
    .map((key: string) => toOrganizedNode(directories, key))
    .value(),
  {
    name: '.',
    parentDirectory: null,
    files: directories['.'].files,
  },
];
