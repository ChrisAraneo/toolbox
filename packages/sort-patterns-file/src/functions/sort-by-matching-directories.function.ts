import { ExtendedFileSystemNode } from 'src/interfaces/extended-file-system-node.interface';

import { sortArrayAlphabetically } from './sort-array-alphabetically.function';

export const sortByMatchingDirectories = (
  node: ExtendedFileSystemNode,
): void => {
  sortArrayAlphabetically(node.matchingDirectories);
};
