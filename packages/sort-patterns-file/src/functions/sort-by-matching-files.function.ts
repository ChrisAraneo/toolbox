import { ExtendedFileSystemNode } from '../interfaces/extended-file-system-node.interface';
import { sortArrayAlphabetically } from './sort-array-alphabetically.function';

export const sortByMatchingFiles = (node: ExtendedFileSystemNode): void => {
  sortArrayAlphabetically(node.matchingFiles);
};
