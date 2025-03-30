import { ExtendedFileSystemNode } from 'src/interfaces/extended-file-system-node.interface';

import { sortArrayAlphabetically } from './sort-array-alphabetically.function';

export function sortByMatchingFiles(node: ExtendedFileSystemNode) {
  sortArrayAlphabetically(node.matchingFiles);
}
